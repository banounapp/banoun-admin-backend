const express = require("express");
const Router = express.Router();
const Event = require("../models/event");
const auth = require("../middleware/auth");
const Specialist = require("../models/specialist");
const nodemailer = require("../config/nodemailer.config");

const axios = require("axios");

const jwt = require("jsonwebtoken");

//Use the ApiKey and APISecret from config.js
const payload = {
  iss: process.env.APIKey,
  exp: new Date().getTime() + 5000,
};

const ZOOM_TOKEN = jwt.sign(payload, process.env.APISecret);

/**************** Pending ***************/
Router.get("/Pending", async (req, res) => {
  try {
    const event = await Event.find({
      status: "Pending",
    }).populate("Specialist");

    res.send(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
/****************get Doc  ***************/
Router.get("/accepted", async (req, res) => {
  try {
    const event = await Event.find({
      status: "accepted",
    }).populate("Specialist");

    res.send(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/****************delete event  ***************/

Router.delete("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("Specialist");
    console.log(event.Specialist.username);

    const specialist = await Specialist.findById(event.Specialist._id);
    specialist.eventnumber = specialist.eventnumber + 1;

    nodemailer.sendDelEvent(event.Specialist.username, event.Specialist.email);
    await specialist.save();

    await Event.findByIdAndRemove(req.params.id);

    res.send("تم حذف الحدث ");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/****************get event  by id ***************/

Router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("Specialist");

    res.send(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/****************patch event  by id ***************/
Router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateEvent = async (zoom_URL) => {
      const review = await Event.findOneAndUpdate(
        { _id: id },
        { status: "accepted", zoom: zoom_URL }
      );
      await review.save();
      res.send(review);
    };

    let axios_options = {
      url: `https://api.zoom.us/v2/users/${process.env.ZOOM_EMAIL}/meetings/`,
      method: "post",

      headers: {
        Authorization: `Bearer ${ZOOM_TOKEN}`,
        "User-Agent": "Zoom-api-Jwt-Request",
        "content-type": "application/json",
      },
      options: {
        status: "active",
      },
      json: true,

      data: {
        start_time: "2019-08-30T22:00:00Z",
        duration: 60,
      },
    };
    let JOIN_URL;
    axios(axios_options)
      .then(function (response) {
        return response.data.join_url;
      })
      .then((joinUrl) => {
        console.log("changed");
        // JOIN_URL = joinUrl;
        console.log(joinUrl);
        updateEvent(joinUrl);
        // res.send(joinUrl);
      });

    // res.send(JOIN_URL);
  } catch (e) {
    res.status(404).send("error while saving updates");
  }
});

module.exports = Router;
