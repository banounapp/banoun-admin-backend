const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db");
const config = require("config");
const cors = require("cors");
const dotenv = require("dotenv");

connectDB();

//body parsing for body in request
app.use(cors());
app.use(express.json());

//routers init
app.use("/api/category", require("./routes/category"));
app.use("/api/upload", require("./routes/img"));
app.use("/api/specialist", require("./routes/specialist"));
app.use("/api/event", require("./routes/event"));
app.use("/api/connectus", require("./routes/connectus "));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
