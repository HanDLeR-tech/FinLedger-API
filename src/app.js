const express = require("express");
const cookieParser = require("cookie-parser");

app = express();

//Note : all the requests that start with with /api/auth will be redirected to authRouter
app.use(express.json());
app.use(cookieParser());

/*
 *ROUTES
 */
const authRouter = require("./routes/auth.routes.js");
const accountRouter = require("./routes/account.routes.js");
const transactionRouter = require("./routes/tranasaction.routes.js");

/**
 * SWAGGER UI
 **/

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../src/config/swagger.js");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/*
 *-Use Routes
 */

app.get("/", (req, res) => {
  res.send(`
     <h2>Banking Ledger Backend API</h2>
    <p>API is running successfully.</p>
    <a href="/api-docs">Open API Documentation</a>`);
});

app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRouter);

module.exports = app;
