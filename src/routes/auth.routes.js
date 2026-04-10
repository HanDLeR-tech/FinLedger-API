const express = require('express');
const authController = require('../controllers/auth.controllers.js');


//Note : this works as a mini express app where all the actual routes are written 
//Note : the app.js redirects all the routes here
const router = express.Router();




/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     description: Creates a new user account with email, name and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Aditya Sharma
 *               email:
 *                 type: string
 *                 example: aditya@gmail.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: 123456
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or email already exists
 */


/* POST /api/auth/register  */
router.post('/register', authController.userRegisterController);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     description: Authenticates user and returns JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: aditya@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful and JWT token returned
 *       401:
 *         description: Invalid credentials
 */

/* POST /api/auth/login  */
router.post('/login', authController.userLoginContoller);




/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     description: Blacklists JWT token and logs the user out.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */



/* POST /api/auth/logOut  */
router.post('/logout', authController.userLogoutController);



module.exports = router;