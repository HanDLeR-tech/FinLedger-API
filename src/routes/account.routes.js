const express = require('express');
const authMiddleware = require('../Middleware/auth.middleware.js');
const accountController = require("../controllers/account.controllers.js");

const router = express.Router();


/*
* - POST /api/accounts/
* - Create a new account
* - Protected Route
*/

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summary: Create a new bank account
 *     tags: [Accounts]
 *     description: Creates a new account for the logged-in user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Account created successfully
 *       401:
 *         description: Unauthorized (JWT missing or invalid)
 */


router.post("/", authMiddleware.authMiddleware,accountController.createAccountController);


/*
* - GET /api/accounts/
* - Get all accounts of the logged in user
* - Protected Route
*/

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Get all accounts of logged-in user
 *     tags: [Accounts]
 *     description: Returns all bank accounts owned by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user accounts
 *       401:
 *         description: Unauthorized
 */


router.get("/", authMiddleware.authMiddleware, accountController.getUserAccountController);

/*
* - GET /api/accounts/balance/:accountId 
*/

/**
 * @swagger
 * /api/accounts/balance/{accountId}:
 *   get:
 *     summary: Get balance of an account
 *     tags: [Accounts]
 *     description: Returns the calculated ledger balance of the account.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the account
 *         example: 665fa12cd56ab123456789ab
 *     responses:
 *       200:
 *         description: Account balance returned
 *       404:
 *         description: Account not found
 */

router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController);



module.exports = router;