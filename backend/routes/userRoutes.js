const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");
const { rateLimiter } = require("../helpers/rate-limiter");

const router = express.Router();

router.route("/").get(protect, allUsers, rateLimiter);
router.route("/").post(registerUser, rateLimiter);
router.post("/login", authUser, rateLimiter);

module.exports = router;
