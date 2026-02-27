require("dotenv").config();

const app = require("./src/app.js");
const ConnectToDB = require("./src/config/db.js");

ConnectToDB();

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
