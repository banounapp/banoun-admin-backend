const express = require("express");
const Router = express.Router();
const Connectus = require("../models/connectus");
const nodemailer = require("../config/nodemailer.config");

Router.post("/send/:id", async (req, res) => {
  try {
    const { text } = req.body;

    const connectus = await Connectus.findById(req.params.id);
    nodemailer.sendConnectus(connectus.name, connectus.email, text);

    res.send({
      message: " تم ارسال الرسالة للعميل  ",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

Router.get("/", async (req, res) => {
  try {
    const connectus = await Connectus.find({});

    res.send(connectus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

Router.delete("/:id", async (req, res) => {
  try {
    await Connectus.findByIdAndRemove(req.params.id);

    res.send("تم الحذف ");
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

module.exports = Router;
