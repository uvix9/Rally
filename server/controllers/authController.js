
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Token = require("../models/tokenModel");

// ================= SIGNUP =================

const signup = async (req, res) => {
  try {
    const { username, displayName, email, password } = req.body;

    if (!username || !displayName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const existingEmail = await User.findUserByEmail(email);

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const existingUsername = await User.findUserByUsername(username);

    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: "Username already taken",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.createUser(
      username,
      displayName,
      email,
      passwordHash
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user,
    });

  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


// ================= LOGIN =================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.account_status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is suspended",
      });
    }

    if (!user.password_hash) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


// ================= GET MY PROFILE =================

const getMe = async (req, res) => {
  try {
    const user = await User.findUserByEmail(req.user.email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


// ================= LOGOUT =================

const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    const decoded = jwt.decode(token);

    if (!decoded || !decoded.exp) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    const expiresAt = new Date(decoded.exp * 1000);

    await Token.revokeToken(token, expiresAt);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};


module.exports = {
  signup,
  login,
  getMe,
  logout,
};



