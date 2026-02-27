const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required to create an account"],
      trim: true,
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Invalid Email Adress",
      ],
      unique: [true, "Email already exists."],
    },

    name: {
      type: String,
      required: [true, "Name is required to create an account"],
    },

    password: {
      type: String,
      required: [true, "Password is required to create an account"],
      minlength: [6, "Password should contain at least 6 characters"],
      selected: false, //NOTE : when user data is fetched the password will not be sent until explicitly requested
    },
    systemUser: {
      type: Boolean,  
      default: false,
      immutable: true,
      select:false 
    }
  },
  {
    timestamps: true, //Note : this tells when the user data was created and last updated
  },
);

// bug :This method is used to hash the password before it is saved into the database

userSchema.pre("save", async function () {
  //Note : pre-save is a hook that is fired before anything is saved

  //Note : this line states if password is not modified then do nothing
  //  "this" here refers to the current document begin saved

  if (!this.isModified("password")) {
    return;
  }

  // Hash the plain password using bcrypt
  // 10 = salt rounds (security cost factor)
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash; //Note : here the encripted password is updated with the plain text

  return;
});

//mongoose has two schemas
// a) schema.statics : functions on the Model (User.findUserByEmail())
// b) schema.methods : functions on each document (user.comparePassword())

userSchema.methods.comparePassword = async function (password) {
  //pasword is the one that is typed by the user and this.password is the one stored in the database
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema); //this creates a user collection in the database with the userSchema as its schema

module.exports = userModel;
