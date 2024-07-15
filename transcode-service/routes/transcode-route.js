const express = require("express");
const router = express.Router();
const { helloWorld } = require("../controllers/transcode");

router.get("/", helloWorld);

module.exports = router;
