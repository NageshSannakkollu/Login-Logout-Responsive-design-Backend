const express = require('express');
const { userRegistration, loginUser, getAllUsers, getUserByEmail, deleteUser,updateUser } = require("../controllers/userController");

const router = express.Router();

router.post("/api/auth/signup", userRegistration);
router.post("/api/auth/login", loginUser);
router.get("/api/users",getAllUsers);
router.post("/api/user",getUserByEmail)
router.put("/api/user/:id",updateUser)
router.delete("/api/user/:id",deleteUser)

module.exports = router;
