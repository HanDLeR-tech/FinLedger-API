const { Router } = require("express");
const  authMiddleware  = require("../Middleware/auth.middleware.js");
const transactionController = require("../controllers/transaction.controller.js");

const transactionRoutes = Router();




/*
 *-POST /api/trasaction/
 *- Create a new trasaction
 */

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Transfer money between accounts
 *     tags: [Transactions]
 *     description: Transfers funds from one account to another using idempotency protection.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromAccount
 *               - toAccount
 *               - amount
 *               - idempotencyKey
 *             properties:
 *               fromAccount:
 *                 type: string
 *                 description: Sender account ObjectId
 *                 example: 665fa12cd56ab123456789ab
 *               toAccount:
 *                 type: string
 *                 description: Receiver account ObjectId
 *                 example: 665fa12cd56ab123456789cd
 *               amount:
 *                 type: number
 *                 description: Amount to transfer
 *                 example: 1000
 *               idempotencyKey:
 *                 type: string
 *                 description: Unique key to prevent duplicate payment
 *                 example: txn-12345
 *     responses:
 *       201:
 *         description: Transaction completed successfully
 *       400:
 *         description: Insufficient balance or invalid accounts
 *       401:
 *         description: Unauthorized
 */


transactionRoutes.post('/', authMiddleware.authMiddleware, transactionController.createTransaction);






/*
 *-POST /api/trasactions/system/initial-funds
 *- Create a initial funds transaction from system user
 */



 /**
 * @swagger
 * /api/transactions/system/initial-funds:
 *   post:
 *     summary: Add initial funds to an account (System User Only)
 *     tags: [Transactions]
 *     description: Transfers funds from the system bank account to a user account. Only accessible by systemUser.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - toAccount
 *               - amount
 *               - idempotencyKey
 *             properties:
 *               toAccount:
 *                 type: string
 *                 description: Receiver account ObjectId
 *                 example: 665fa12cd56ab123456789cd
 *               amount:
 *                 type: number
 *                 example: 5000
 *               idempotencyKey:
 *                 type: string
 *                 example: init-1001
 *     responses:
 *       201:
 *         description: Initial funds added successfully
 *       403:
 *         description: Only system user can perform this action
 */


 transactionRoutes.post('/system/initial-funds', authMiddleware.authSystemUserMiddleware, transactionController.createInitialFundsTransaction);


module.exports = transactionRoutes;
