const express =require ("express");
const { register, login, logout } =require ("../controllers/auth.controller.js");
const { validateBody } =require ("../middlewares/validate.middleware.js");

const router = express.Router();

// POST /api/auth/register
router.post("/register", validateBody, register);

// POST /api/auth/login
router.post("/login", validateBody, login);

// POST /api/auth/logout
router.post("/logout", logout);

module.exports = router;
