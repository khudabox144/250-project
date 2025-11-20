// services/auth.service.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

// ------------------------------
// PASSWORD HELPERS
// ------------------------------
const hashPassword = async (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const comparePassword = async (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

// ------------------------------
// TOKEN HELPERS
// ------------------------------
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

// ------------------------------
// REGISTER USER
// ------------------------------
const register = async (data) => {
  const { name, email, password, role } = data;

  const exists = await User.findOne({ email });
  if (exists) throw new Error("User already exists");

  const hashed = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role: role || "user",
  });

  return user;
};

// ------------------------------
// LOGIN USER
// ------------------------------
const login = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("User not found");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Invalid password");

  const token = generateToken(user);

  return { user, token };
};

// ------------------------------
// REFRESH TOKEN (simple version)
// ------------------------------
const refresh = async (refreshToken) => {
  const decoded = verifyToken(refreshToken);

  if (!decoded) throw new Error("Invalid refresh token");

  const user = await User.findById(decoded.id);
  if (!user) throw new Error("User no longer exists");

  const newToken = generateToken(user);

  return { user, token: newToken };
};

// ------------------------------
// LOGOUT (simple fake logout)
// ------------------------------
const logout = async () => {
  return true; // handled on frontend (delete token)
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  login,
  register,
  refresh,
  logout,
};
