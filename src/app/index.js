const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const middleware = require("./middleware");

const app = express();
const apiRoute = require("./Route");

// Assets
app.use("/assets", express.static("assets"));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(middleware.setHeader);
app.use(logger("dev")); // Show on console detail requests

// Apis
app.use("/api", apiRoute);

// Handle Error
app.use(middleware.notFound);
app.use(middleware.unAuthorized);

module.exports = app;