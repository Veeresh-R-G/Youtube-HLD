const fs = require("fs");
const AWS = require("aws-sdk");
const path = require("path");

const helloWorld = (req, res) => {
  res.status(200).send("Hello World");
};

const uploadFileS3 = async (req, res) => {
  // console.log(req);

  if (!req.file) {
    res.status(402).send("File not Found");
    return;
  }

  // const filePath = path.join(__dirname, "..", "assets", "front_id.jpeg");

  // if (!fs.existsSync(filePath)) {
  //   console.log(`File Path doesn't exist : ❌`);
  //   res.status(400).send("File Doesn't Exist !!!");
  //   return;
  // }

  AWS.config.update({
    region: "ap-south-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const file = req.file;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: file.originalname,
    Body: file.buffer,
  };

  const s3 = new AWS.S3();

  s3.upload(params, (error, data) => {
    if (error) {
      console.log(error);
      res.status(404).send("File Couldn't be uploaded");
      return;
    }

    res.status(200).send(`File Uploaded Successfully ${data.Location}`);
  });
};

module.exports = {
  uploadFileS3,
  helloWorld,
};
