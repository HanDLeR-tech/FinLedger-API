const accountModel = require("../models/account.model.js");


async function createAccountController(req, resp) {
    
    const user = req.user;

    const account = await accountModel.create({
        user:user._id
    })

    resp.status(201).json({
        account
    })
}

async function getUserAccountController(req, resp) {
    const accounts = await accountModel.find({ user: req.user._id });

   resp.status(200).json({
        accounts
    })
}

async function getAccountBalanceController(req, resp) {
    const { accountId } = req.params;

    const account = await accountModel.findOne({ _id: accountId, user: req.user._id });

    if (!account) {
        return resp.status(404).json({
            message: "Account Not Found"
        });
    }

    const balance = await account.getBalance();

    resp.status(200).json({
        accountId: account._id,
        balance: balance
    })
}

module.exports = {  
    createAccountController,
    getUserAccountController,
    getAccountBalanceController
}