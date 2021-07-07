const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");
const Specialist = require("../models/specialist");
const { body, validationResult } = require("express-validator");
const config = require("config");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login admin

router.post(
  "/",
  [
    body("email", "username is required").exists(),
    body("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      // destructing Body =>  username , password

      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).send("please provide email and password");
      }
      // get user

      admin = await Admin.findOne({ email: email });

      if (!admin) {
        return res.status(200).json({
          isSuccess: false,
          code: 1,
          error: "Wrong Username Or Password",
        });
      } else {
        type = "User";
      }

      const isMatch = bycrpt.compare(password, FoundUser.password);

      if (isMatch) {
        // create a JWT Token
        const secret = config.get("jwtSecret");

        const token = jwt.sign({ id: FoundUser._id }, secret, {
          expiresIn: 360000,
        });

        res.send({
          code: 0,
          isSuccess: true,
          token: token,
          type: type,
        });
      } else {
        return res.status(402).send({
          isSuccess: false,
          code: 2,
          message: "Wrong Username Or Password",
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ errors: "Server Error" });
    }
  }
);

module.exports = router;
