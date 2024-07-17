const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const {
  uploadFileS3,
  helloWorld,
  initialiseMultiPartUpload,
  uploadChunk,
  completeUpload,
} = require("../controllers/uploadS3");
const { publishToKafka } = require("../controllers/publish");

router.get("/", helloWorld);

router.post("/initialize", upload.none(), initialiseMultiPartUpload);

router.post("/upload", upload.single("chunk"), uploadChunk);

router.post("/complete", completeUpload);

router.post("/publish", publishToKafka);
module.exports = router;
