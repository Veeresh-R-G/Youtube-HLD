const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");

AWS.config.update({});

const app = express();

app.use(
  cors({
    allowedHeaders: ["*"],
    origin: "*",
  })
);
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log(`App listening on PORT : ${process.env.PORT}`);
});
