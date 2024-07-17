const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const {
  uploadFileS3,
  helloWorld,
  initialiseMultiPartUpload,
} = require("../controllers/uploadS3");
const { publishToKafka } = require("../controllers/publish");

router.get("/", helloWorld);

router.post("/upload", upload.single("chunk"), uploadFileS3);

router.post("/publish", publishToKafka);

router.post("/initialize", upload.none(), initialiseMultiPartUpload);

module.exports = router;
