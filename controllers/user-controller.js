const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { isEmail } = require("validator");
const User = require("../model/User");

// Validate Signup Data
const validateSignupData = async (req, res) => {
  const { username, email, password } = req.body;

  if (username.trim().length === 0) {
    res.status(400).json({ message: "Please Enter a Username" });
    return false;
  }

  if (!isEmail(email)) {
    res.status(400).json({ message: "Please Enter a valid email" });
    return false;
  }

  if (password.trim().length === 0) {
    res.status(400).json({ message: "Please Enter password" });
    return false;
  } else if (password.trim().length <= 5) {
    res
      .status(400)
      .json({ message: "Minimum password length is 6 characters" });
    return false;
  }

  // check if email exists in DB!
  const existingUser = await User.findOne({ email: email }).exec();
  if (existingUser) {
    console.log("Email Already Registered");
    res.status(400).json({ message: "Email Already Registered" });
    return false;
  }

  return true;
};

// Signup controller
const signup = async (req, res) => {
  try {
    const { username, password, email, photo, firstName, lastName } = req.body;

    // Validate Inputs
    const isValid = await validateSignupData(req, res);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (isValid) {
      try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin
        const admin = new User({
          email,
          username,
          password: hashedPassword,
          photo,
          firstName,
          lastName,
        });

        // Save the admin to the database
        await admin.save();

        res.status(201).json({ message: "User created successfully" });
      } catch (err) {
        console.log(err);
        return res.status(400).json({ message: err });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await User.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ adminId: admin._id }, "secret", {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "User Login Successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const requireAuth = (req, res) => {
  const { token } = req.body;

  if (token) {
    try {
      const decode = jwt.verify(token, "secret");

      res.json({
        auth: true,
        data: decode,
      });
    } catch (error) {
      res.json({
        auth: false,
        data: error.message,
      });
    }
  } else {
    res.json({
      auth: false,
      data: "No Token Found in request",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  signup,
  login,
  requireAuth,
  getAllUsers,
};
