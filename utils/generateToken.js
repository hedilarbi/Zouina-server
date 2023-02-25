const jwt = require("jsonwebtoken");
require("dotenv/config");

const generateToken = (id, account_type) => {
  return jwt.sign(
    {
      id,
      account_type,
    },
    process.env.SECRET_KEY
  );
};

module.exports = generateToken;
