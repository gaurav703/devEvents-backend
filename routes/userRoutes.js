const express = require("express");
const userContoller = require("../controllers/user-controller");
const router = express.Router();

// Authentication routes
router.post("/signup", userContoller.signup);
router.post("/login", userContoller.login);
router.post("/requireAuth", userContoller.requireAuth);
router.get("/", userContoller.getAllUsers);

module.exports = router;
