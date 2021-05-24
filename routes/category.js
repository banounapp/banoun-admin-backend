const express = require("express");
const Router = express.Router();
const { body, validationResult } = require("express-validator");
const config = require("config");
const bycrpt = require("bcryptjs");
//Schema
const Category = require("../models/Category");

//post Gategory
Router.post('/')