var express = require("express");
var blank = express.Router();

/* GET home page. */
blank.get("/", function(req, res, next) {
  res.render("blankpage", { title: "Express" });
});

module.exports = blank;
