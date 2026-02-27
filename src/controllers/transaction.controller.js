const { transactionModel } = require("../models/transaction.model.js");
const ledgerModel = require("../models/ledger.model.js");
const accountModel = require("../models/account.model.js");
const emailService = require("../services/email.service.js");
const mongoose = require("mongoose");

/**
 *  -Create a new Transaction
 * THE 10 STEP TRANSFER FLOW:*
 *1.Validate request
 *2.Validate idempotency key
 *3.Check Account Status
 *4.Dervie Balance from Ledger
 *5. Create Transaction(PENDING)
 *6.Create DEBIT Ledger entry
 *7. Create CREDIT Ledger entry
 *8. Mark Transaction COMPLETED
 *9. Commit MongoDB sessions
 *10. Send Emial Notification
 **/

async function createTransaction(req, resp) {
  /**
   *1.Validate Request
   **/

  const { toAccount, fromAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !fromAccount || !amount || !idempotencyKey) {
    return resp.status(400).json({
      message: "FromAccount,ToAccount,Amount and IdempotencyKey are required",
    });
  }

  const fromUserAccount = await accountModel.findOne({ _id: fromAccount });

  const toUserAccount = await accountModel.findOne({ _id: toAccount });

  if (!fromUserAccount || !toUserAccount) {
    return resp.status(400).json({
      message: "Invalid toAccount or fromAccount",
    });
  }

  /**
   *2.Validate idempotency key
   **/

  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status === "COMPLETED") {
      return resp.status(200).json({
        message: "Transaction is already Completed",
        transaction: isTransactionAlreadyExists,
      });
    }

    if (isTransactionAlreadyExists.status === "PENDING") {
      return resp.status(200).json({
        message: "Transaction is under Process",
      });
    }
    if (isTransactionAlreadyExists.status === "REVERSED") {
      return resp.status(500).json({
        message: "Transaction was reversed , please retry",
      });
    }
    if (isTransactionAlreadyExists.status === "FAILED") {
      return resp.status(500).json({
        message: "Transaction processing failed , please retry",
      });
    }
  }

  /**
   *3.Check Account Status
   **/

  if (fromUserAccount.status != "ACTIVE" || toUserAccount.status != "ACTIVE") {
    return resp.status(400).json({
      message:
        "Both ToAccount and FromAcount must be ACTIVE to process transaction",
    });
  }

  /**
   *4.Dervie Balance from Ledger
   **/

  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    return resp.status(400).json({
      message: `Insufficient balance. Current balance is ${balance}.Amount to be withdrawn is ${amount}`,
    });
  }

  /**
   *5.Create Transaction(PENDING)
   **/

  let transaction;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
     
    transaction = (
      await transactionModel.create(
        [
          {
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING",
          },
        ],
        { session },
      )
    )[0];

    const debitLedgerEntry = await ledgerModel.create(
      [
        {
          account: fromAccount,
          amount: amount,
          transaction: transaction._id,
          type: "DEBITED",
        },
      ],
      { session },
    );

  await new Promise(resolve => setTimeout(resolve, 60000));

    const creditLedgerEntry = await ledgerModel.create(
      [
        {
          account: toAccount,
          amount: amount,
          transaction: transaction._id,
          type: "CREDITED",
        },
      ],
      { session },
    );

    await transactionModel.findOneAndUpdate(
      { _id: transaction._id },
      { status: "COMPLETED" },
      { session },
    );

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    return resp.status(400).json({
      message:
        "Transaction is pending due to some issues , try after some time",
    });
  }

  /**
   *10. Send Emial Notification
   **/

  await emailService.sendTransactionEmail(
    req.user.email,
    req.user.name,
    amount,
    toAccount,
  );

  return resp.status(201).json({
    message: "Transaction completed Successfully",
    transaction: transaction,
  });
}

async function createInitialFundsTransaction(req, resp) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return resp.status(400).json({
      message: "ToAccount,Amount and IdempotencyKey are required",
    });
  }

  const toUserAccount = await accountModel.findOne({ _id: toAccount });

  if (!toUserAccount) {
    return resp.status(400).json({
      message: "Invalid toAccount",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    user: req.user._id,
  });

  if (!fromUserAccount) {
    return resp.status(400).json({
      message: "System User Account Not Found",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = new transactionModel({
    fromAccount: fromUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status: "PENDING",
  });

  const debitLedgerEntry = await ledgerModel.create(
    [
      {
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBITED",
      },
    ],
    { session },
  );

  const creditLedgerEntry = await ledgerModel.create(
    [
      {
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDITED",
      },
    ],
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  return resp.status(201).json({
    message: "Initial Transaction completed successfully",
    transaction: transaction,
  });
}

module.exports = {
  createTransaction,
  createInitialFundsTransaction,
};
