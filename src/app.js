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
// CORS: allow origins from env `CLIENT_ORIGIN` (comma-separated).
// For local `.env` compatibility we also accept `CLIENT_URL`.
// Example: CLIENT_ORIGIN=https://your-frontend.example.com,http://localhost:3000
const clientOrigin = process.env.CLIENT_ORIGIN || process.env.CLIENT_URL || "http://localhost:3000";
const allowedOrigins = clientOrigin.split(',').map((s) => s.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser requests (curl, server-to-server) when no origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('CORS policy does not allow this origin.'), false);
    },
    credentials: true,
  })
);

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
app.use("/api/map", require("./routes/map.routes.js"));
app.use("/api/bookings", require("./routes/booking.routes.js"));

// Root health-check / basic info route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running', routes: '/api/*' });
});

// API index route: useful for /api requests without a specific endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API root - available endpoints',
    endpoints: ['/api/auth', '/api/users', '/api/tours', '/api/packages', '/api/reviews', '/api/admin']
  });
});

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
