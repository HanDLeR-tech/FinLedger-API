const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Banking Ledger API",
      tags: [
        { name: "Auth", description: "User authentication APIs" },
        { name: "Accounts", description: "User bank account operations" },
        { name: "Transactions", description: "Money transfer operations" },
      ],
      description: `
## Banking Ledger Backend (Fintech Transaction System)

This project simulates a real banking backend using double-entry accounting and idempotent payment processing.

---

### How to Use the API (Follow in Order)

#### 1️⃣ Register a user
Call **POST /auth/register**

Create a new customer account using:
- name
- email
- password

---

#### 2️⃣ Login
Call **POST /auth/login**

You will receive a JWT token.

Copy the token.

---

#### 3️⃣ Authorize
Click the 🔒 **Authorize** button (top right).

Paste:
Bearer YOUR_TOKEN

Now all protected APIs will work.

---

#### 4️⃣ Create Bank Account
Call **POST /accounts**

This creates a bank account linked to your user.

---

#### 5️⃣ Get Your Account ID
Call **GET /accounts**

Copy the \`_id\` of your account.
You will need it for balance and transactions.

---

#### 6️⃣ Add Initial Funds (Admin/System Only)
The bank system account credits funds to user accounts using:

POST /transactions/system/initial-funds

(Only system user can perform this action)

---

#### 7️⃣ Check Balance
Call:

GET /accounts/balance/{accountId}

Balance is calculated from ledger entries (not stored directly).

---

#### 8️⃣ Transfer Money
Call:

POST /transactions

Required fields:
- fromAccount
- toAccount
- amount
- idempotencyKey

---

### Key Features
- Double-entry ledger accounting
- MongoDB ACID transactions
- Idempotent payment processing
- JWT authentication
- Token blacklisting logout

`,
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  // ⭐ THIS IS THE IMPORTANT FIX
  apis: [path.join(__dirname, "../routes/*.js")],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
