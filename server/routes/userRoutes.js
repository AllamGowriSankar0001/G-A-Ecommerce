const express = require("express");
const { Signup, Login, Allusers, getMe, updateMe } = require("../controllers/userController");
const Auth = require("../middleware/AuthVerify");

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/allusers", Auth, Allusers);

// Basic auth check for frontend
router.get("/verify", Auth, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// Current user profile
router.get("/me", Auth, getMe);
router.put("/me", Auth, updateMe);

module.exports = router;
 