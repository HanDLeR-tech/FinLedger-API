# FinLedger-API

## Overview
FinLedger is a backend banking ledger service that simulates core banking operations such as user registration, account creation, balance tracking, and secure fund transfers.

The system ensures data consistency using MongoDB multi-document transactions and atomic session-based operations. It prevents inconsistent balances and double-spending scenarios during concurrent transfers. Registered users also receive confirmation emails using Nodemailer integration.

---

## Key Features
- User registration with email notification
- Account creation linked to users
- Balance tracking
- Deposit and withdrawal operations
- Secure peer-to-peer money transfers
- Automatic rollback on transaction failure
- Protection against race conditions and double spending
- Email confirmation on successful registration

---

## Tech Stack
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- MongoDB Transactions & Sessions
- Nodemailer (Email Service)
- REST API Architecture

---

## Why This Project Matters
Financial systems must guarantee consistency when multiple operations occur simultaneously.  
This project demonstrates how ACID database transactions can be implemented in a backend service to safely update balances across multiple accounts.

It simulates how real banking systems avoid partial updates (e.g., money deducted but not credited).

---

## API Example

### Transfer Money
POST /api/transfer

Request Body:
{
  "fromAccount": "A123",
  "toAccount": "B456",
  "amount": 500
}

If the transfer fails at any step, the database automatically rolls back to the previous state.

---

## Running Locally

1. Clone the repository
2. Install dependencies

npm install

3. Create a .env file and add:

MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  
PORT=5000  

# Email Configuration (Nodemailer - Gmail OAuth2)
EMAIL_USER=your_email@gmail.com  
CLIENT_ID=your_google_client_id  
CLIENT_SECRET=your_google_client_secret  
REFRESH_TOKEN=your_refresh_token  

4. Start the server

node server.js

Server will run on:
http://localhost:5000

---

## Deployment
Backend deployed on cloud server (Render) with MongoDB Atlas database.git add README.md