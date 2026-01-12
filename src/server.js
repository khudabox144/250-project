const dotenv = require("dotenv");
// Load environment variables as early as possible so config files (e.g. Cloudinary)
// that read process.env get the values when required.
dotenv.config();

const express = require("express");
const { connectDB } = require("./config/db.js");
const app = require("./app.js");

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
