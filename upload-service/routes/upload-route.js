const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const { uploadFileS3, helloWorld } = require("../controllers/uploadS3");
const { publishToKafka } = require("../controllers/publish");

router.get("/", helloWorld);

router.post("/upload", upload.single("file"), uploadFileS3);

router.post("/publish", publishToKafka);
module.exports = router;
