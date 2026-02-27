const mongoose = require("mongoose");

function ConnectToDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Server is conncected to DB");
    })
    .catch((err) => {
      console.log("Error Ocuured :" + err);
      process.exit(1);
    });
}

module.exports = ConnectToDB;
