const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (userId) => {
  console.log('Generating token for user ID:', userId);
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
  
  const payload = {
    id: userId,
    iat: Math.floor(Date.now() / 1000)
  };
  
  console.log('Token payload:', payload);
  
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  
  console.log('Generated token:', token.substring(0, 20) + '...');
  return token;
};

const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = { generateToken, hashPassword, comparePassword };
