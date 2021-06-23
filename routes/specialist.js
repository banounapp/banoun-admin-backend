const express = require("express");
const Router = express.Router();
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const config = require("config");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Specialist = require("../models/specialist");
const nodemailer = require("../config/nodemailer.config");
const auth = require("../middleware/auth");
//for image
const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
// const dbConnection =require('../config/db');
const connection = require("../connection");
// const Appointment = require("../models/appointment");

const { equal } = require("assert");
///////////////////////////////////////////////////////////////////////////////////////////////////
const storage = new GridFsStorage({
  url: "mongodb+srv://omar1234:omar@banoun.lrzmb.mongodb.net/main?retryWrites=true&w=majority",
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });
let gfs;
connection.once("open", () => {
  gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection("uploads");
});

/////////////////////////////////////////////////////////////////////////////////////////////////////
Router.get("/approval", async (req, res) => {
  try {
    const specialist = await Specialist.find({ statusjob: "approval" });
    res.json(specialist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////
Router.get("/:id", async (req, res) => {
  try {
    const specialist = await Specialist.findOne({ _id: req.params.id });

    res.json(specialist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////
Router.get("/Pending", async (req, res) => {
  try {
    const specialist = await Specialist.find({ statusjob: "Pending" });

    res.json(specialist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////

Router.patch("/:id", async (req, res) => {
  try {
    const specialist = await Specialist.findOneAndUpdate(
      { _id: req.params.id },
      { statusjob: "approval" }
    );
    // if (specialist) {
    //   specialist
    // }
    if (specialist) {
      nodemailer.sendApproval(specialist.username, specialist.email);
    }

    res.json(specialist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
////////////////////////////////////////////////////////////////////////////////////////
Router.delete("/:id", async (req, res) => {
  try {
    const specialist = await Specialist.findById(req.params.id);
    if (specialist) {
      nodemailer.sendReject(specialist.username, specialist.email);
    }
    await Specialist.findOneAndRemove({
      _id: req.params.id,
    });

    res.json("تم الحذف ");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = Router;
