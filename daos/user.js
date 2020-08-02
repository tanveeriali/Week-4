const mongoose = require("mongoose");
const User = require("../models/user");
const Token = require("../models/token");
const uuid = require('uuid');
const bcrypt = require("bcrypt");
const salt = 10;

module.exports = {};

module.exports.changePassword = async ( userId, password) => {
    try {
        const newPWHash = await bcrypt.hash(password, salt);
        const user = User.updateOne({ _id: userId }, {  password: newPWHash });
        return user;
    } catch (e) {
        throw e;
    }
}
module.exports.logOut = async (token) => {
    try {
        const tokenDeleted = await Token.deleteOne({token: token});
        return true
    } catch (e) {
        throw e;
    }
}

module.exports.loginUser = async (email,password) => {
    const user = await User.findOne({ email : email }).lean();
    if (!user) { 
        return false; 
    }
    else {
       const compared = await bcrypt.compare(password, user.password);
       if (compared) {
            const createToken = await Token.create({token: uuid.v4(), userId: user._id});
            return createToken
       }
    }
}
module.exports.userCheck = async (email,password) => {
  const user = await User.findOne({ email: email});
  return user
};
module.exports.createUser = async (email, password) => {
  try {
        const user = await User.create({email: email, password: password});
        return user;
  } catch (e) {
    if (e.message.includes("Failed")) {
      throw new BadDataError(e.message);
    }
    throw e;
  }
};


class BadDataError extends Error {}
module.exports.BadDataError = BadDataError;
