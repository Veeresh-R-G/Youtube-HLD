const fs = require("fs");

const helloWorld = (req, res) => {
  res.status(200).send("Hello World");
};

const uploadFileS3 = async (req, res) => {
  const filePath = "../assets/front_id.jpeg";

  if (fs.existsSync(filePath)) {
    console.log(`File Path doesn't exist : ❌`);
    res.status(400).send("File Doesn't Exist !!!");
    return;
  }

  AWS.config.update({
    region: "ap-south-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: "front_id.jpeg",
    Body: fs.createReadStream(filePath),
  };

  const s3 = new AWS.S3();

  s3.upload(params, (error, data) => {
    if (err) {
      console.log(`Error While uploading the file to s3`);
      res.status(404).send("File Couldn't be uploaded");
      return;
    }

    console.log(`Data == ${data}`);
    res.status(200).send("File Uploaded Successfully");
    return;
  });
};

module.exports = {
  uploadFileS3,
  helloWorld,
};
