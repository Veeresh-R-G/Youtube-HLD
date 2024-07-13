const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const { uploadFileS3, helloWorld } = require("../controllers/uploadS3");

router.get("/", helloWorld);

router.post("/upload", upload.single("file"), uploadFileS3);

module.exports = router;
