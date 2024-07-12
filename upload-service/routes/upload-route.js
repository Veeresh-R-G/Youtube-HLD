const express = require("express");
const router = express.Router();

const { uploadFileS3, helloWorld } = require("../controllers/uploadS3");

router.get("/", helloWorld);

router.post("/upload", uploadFileS3);

module.exports = router;
