const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // now using better-sqlite3 sync API

// Registration endpoint
const userRegistration = async (req, res) => {
  const { name,email, password } = req.body;
  // console.log(req.body)
  try {
    // Will throw if duplicate email, etc.
    const newUser = User.create(name, email, password);
    return res.status(201).json({
      message: "New User Created Successfully!",
      user: newUser,
      success: true
    });
  } catch (err) {
    if (err && err.message && err.message.toLowerCase().includes("unique constraint")) {
      // better-sqlite3 will throw for unique email violation
      return res.status(200).json({ message: "Email already exists", success: false });
    }
    return res.status(500).json({ message: "Registration error", success: false });
  }
};

// Login endpoint
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = User.getByEmail(email);
    if (!user) {
      return res.status(200).json({ message: "Invalid Email Address!", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({ message: "Invalid password!!", success: false });
    }

    const payload = { email: email };
    const token = jwt.sign(payload, `${process.env.JWT_SECRET}`);

    res.status(200).json({
      jwtToken: token,
      success: true,
      message: "Login Success",
      user
    });
  } catch (err) {
    return res.status(500).json({ message: "Login error", success: false });
  }
};

// ALL users
const getAllUsers = (req, res) => {
  try {
    const users = User.getAll(); // synchronous method on your user model to get all users
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
    });
  }
};

const getUserByEmail = (req,res) => {
    const {email} = req.body;
    try {
    const users = User.getByEmail(email); // synchronous method on your user model to get all users
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
    });
  }
}

const updateUser = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedUser = User.updateById(id, data); // <-- custom model method

    if (updatedUser) {
      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: updatedUser,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: err.message,
    });
  }

};

const deleteUser = (req, res) => {
  const { id } = req.params;
//   res.send({"ID":id})
  try {
    const success = User.deleteById(id);
    if (success) {
      return res.status(200).json({ success: true, message: "User deleted" });
    } else {
      return res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

module.exports = { userRegistration, loginUser,getAllUsers,getUserByEmail,deleteUser,updateUser };
