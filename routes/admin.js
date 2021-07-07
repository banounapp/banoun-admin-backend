const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");
const { body, validationResult } = require("express-validator");
const config = require("config");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login admin

router.post(
  "/",
  [
    body("email", "eami; is required").exists(),
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

      console.log(req.body);
      console.log(email);

      const admin = await Admin.findOne({ email: email });

      //  const admin = await Admin.find({});
      console.log(admin);

      if (!admin) {
        return res.status(200).json({
          isSuccess: false,
          code: 1,
          error: "Wrong email Or Password",
        });
      }
      let hashPassword = await bycrpt.hash(admin.password, 10);

      // const isMatch = await bcrypt.compare(password, hashPassword);
      const isMatch = password == admin.password;

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Wrong email Or Passwor" }] });
      } else {
        const secret = config.get("jwtSecret");
        const token = jwt.sign({ id: admin._id }, secret, {
          expiresIn: 360000,
        });
        res.send({
          code: 0,
          isSuccess: true,
          data: admin,
          token: token,
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ errors: "Server Error" });
    }
  }
);

module.exports = router;
