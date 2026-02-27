const userModel = require("../models/user.models.js");
const jwt = require("jsonwebtoken");
const tokenBlackListedModel = require("../models/blackList.models.js");

async function authMiddleware(req, resp, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return resp.status(401).json({
      message: "Unauthorized access,token is missing",
    });
  }

  const isBlackListed = await tokenBlackListedModel.findOne({ token });

  if (isBlackListed) {
     return resp.status(401).json({
      message: "Unauthorized access,token is invalid",
    }); 
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId);

    req.user = user;
    return next();


  } catch (err) {
    return resp.status(401).json({
      message: "Unauthorized access,token is missing",
    });
  }
}

async function authSystemUserMiddleware(req, resp, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return resp.status(401).json({
      message: "Unauthorized access,token is missing",
    });
  }


  const isBlackListed = await tokenBlackListedModel.findOne({ token });

  if (isBlackListed) {
     return resp.status(401).json({
      message: "Unauthorized access,token is invalid",
    }); 
  }



  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId).select("+systemUser");

    if (!user.systemUser) {
      return resp.status(403).json({
        message: "Forbidden access,not a system user",
      });
    }

    req.user = user;

    return next();

  } catch (err) {
    return resp.status(401).json({
      message: "Unauthorized access,token is missing",
    });
  }
}

module.exports = {
  authMiddleware,authSystemUserMiddleware
};
