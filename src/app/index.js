const express    = require("express");
const bodyParser = require("body-parser");
const logger     = require("morgan");
const middleware = require("./middleware");
const cors       = require('cors');

const app        = express();
const apiRoute   = require("./Route");

app.use(cors()); // Allow accept origin
// app.use(middleware.setHeader);

// Assets
app.use("/assets", express.static("assets"));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger("dev")); // Show on console detail requests

// Apis
app.use("/api", apiRoute);

// Handle Error
app.use(middleware.notFound);
app.use(middleware.unAuthorized);

module.exports = app;