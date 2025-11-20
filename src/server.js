const express =require ("express");
const { connectDB } =require ("./config/db.js");
const dotenv =require ("dotenv");
const app =require ("./app.js");

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
