const fs = require("fs");
const AWS = require("aws-sdk");

const helloWorld = (req, res) => {
  res.status(200).send("Hello World");
};

const initialiseMultiPartUpload = async (req, res) => {
  try {
    console.log("Multipart initialising");
    const { filename } = req.body;
    console.log(filename);

    const s3 = new AWS.S3({
      region: "ap-south-1",
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    const createParams = {
      Bucket: bucketName,
      Key: filename,
      ContentType: "video/mp4",
    };

    const multipartParams = await s3
      .createMultipartUpload(createParams)
      .promise();
    const uploadID = multipartParams.UploadId;

    res.status(200).send({ uploadID });
  } catch (error) {
    console.log(`Couldn't Initialise Multipart Upload  ${error}`);
    res.status(500).send("Upload Initialization Failed");
  }
};

const uploadChunk = async (req, res) => {
  try {
    console.log("Uploading Chunk");
    const { filename, chunkindex, uploadId } = req.body;

    const s3 = new AWS.S3({
      region: "ap-south-1",
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const chunkParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filename,
      UploadId: uploadId,
      PartNumber: parseInt(chunkindex) + 1,
      Body: req.file.buffer,
    };

    const data = await s3.uploadPart(chunkParams).promise();
    // console.log(JSON.stringify(data));
    console.log(`Chunk Upload ---- ${data.ETag}`);
    res.status(200).send({
      message: `Upload Chunk ${chunkindex} successful !!! `,
      ETag: data?.ETag,
    });
  } catch (error) {
    console.log(`Error while uploading chunk  ${error}`);
    res.status(500).send(`Couldn't Upload chunk`);
  }
};

const completeUpload = async (req, res) => {
  try {
    console.log("In Complete Phase");

    const { filename, uploadId, uploadResults } = req.body;

    console.log(uploadResults);
    const s3 = new AWS.S3({
      region: "ap-south-1",
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const completeParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filename,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: uploadResults.map(({ ETag }, i) => ({
          ETag,
          PartNumber: i + 1,
        })),
      },
    };

    const data = await s3.completeMultipartUpload(completeParams).promise();
    console.log(`Upload Complete ${data}`);
    res.status(200).send("Upload Complete");
  } catch (error) {
    console.log(`Error while completing upload ${error}`);
    res.status(500).send("Couldn't Complete Upload");
  }
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
  initialiseMultiPartUpload,
  uploadChunk,
  completeUpload,
};
