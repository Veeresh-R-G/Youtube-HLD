const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes/upload-route");

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    allowedHeaders: ["*"],
    origin: "*",
  })
);

app.use("/api/v1", routes);

app.listen(process.env.PORT, () => {
  console.log(`App listening on PORT : ${process.env.PORT}`);
});
