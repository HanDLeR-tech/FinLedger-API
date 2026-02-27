const userModel = require("../models/user.models.js");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service.js");
const tokenBlackListModel = require("../models/blackList.models.js");
const { response } = require("express");
/*
 * - user register controller
 * - POST /api/auth/register
 */

async function userRegisterController(req, resp) {
  const { email, password, name } = req.body;

  const isExists = await userModel.findOne({ email: email });

  if (isExists) {
    resp.status(422).json({
      message: "User already exists with email",
      status: "Failed",
    });
  } else {
    const user = await userModel.create({ email, password, name });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    resp.cookie("token", token);

    resp.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });

    await emailService.sendRegistrationEmail(user.email, user.name);
  }
}

/*
 * - user login controller
 * - POST /api/auth/login
 */

async function userLoginContoller(req, resp) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return resp.status(401).json({
      message: "Email or Password is Invalid",
    });
  }

  const isvalidPassword = await user.comparePassword(password);

  if (!isvalidPassword) {
    return resp.status(401).json({
      message: "Email or Password is Invalid",
    });
  }

  token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  resp.cookie("token", token);

  resp.status(200).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    token,
  });
}

/*
 * - user logout controller
 * - POST /api/auth/logout
 */

async function userLogoutController(req, resp) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return resp.status(200).json({
      message: "User is already logged out",
    });
  }

  await tokenBlackListModel.create({
    token: token,
  });

  resp.clearCookie("token", "");

  return resp.status(200).json({
    message: "User logged out successfully",
  });
}

module.exports = {
  userRegisterController,
  userLoginContoller,
  userLogoutController,
};
