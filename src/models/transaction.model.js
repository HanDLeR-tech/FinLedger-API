const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must be associated with a to Account"],
      index: true,
    },
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must be associated with a from Account"],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["PENDING", "COMPLETED", "REVERSED", "FAILED"],
        message: "Status can be PENDING,COMPLETED,REVERSED,FAILED",
      },
      default: "PENDING",
    },
    amount: {
      type: String,
      min: [0, "Transaction account cannot be negative"],
    },
    idempotencyKey: {
      type: String,
      required: [true, "Idempotency key is reuired to create a Transaction"],
      index: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);


const transactionModel = mongoose.model("transaction", transactionSchema);


module.exports = { transactionModel };