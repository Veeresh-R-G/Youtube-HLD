const express = require("express");
const cors = require("cors");
const routes = require("./routes/transcode-route");
const app = express();
const { KafkaConfig } = require("./kafka/kafka");

app.use(
  cors({
    allowedHeaders: ["*"],
    origin: "*",
  })
);

const kafkaConfig = new KafkaConfig();
// kafkaConfig.init("transcode");

kafkaConfig.consume("transcode", (value) => {
  console.log(`Got Data from KAfka : ${value}`);
});

app.use("/api/v2", routes);

app.listen(process.env.PORT || 4000, () => {
  console.log(`App listening on PORT : ${process.env.PORT}`);
});
