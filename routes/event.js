const express = require("express");
const Router = express.Router();
const Event = require("../models/event");
const auth = require("../middleware/auth");
const Specialist = require("../models/specialist");
const nodemailer = require("../config/nodemailer.config");

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

module.exports = Router;
