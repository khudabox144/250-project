const express = require("express");
const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const tourRoutes = require("./routes/tourPlace.routes.js");
const packageRoutes = require("./routes/package.routes.js");
const reviewRoutes = require("./routes/review.routes.js");
const adminRoutes = require("./routes/admin.routes.js");
const divisionRoutes= require("./routes/division.routes.js")
const districtRoutes= require("./routes/district.routes.js")
const AppError = require("./utils/AppError.js");



const path = require("path");
const app = express();
const cors = require('cors');
app.use(express.json());
// Allow frontend on localhost:3000 in development. Adjust origin for production.
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Serve uploaded files (so frontend can access image URLs at /uploads/filename)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/divisions", divisionRoutes);
app.use("/api/districts", districtRoutes);

app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
