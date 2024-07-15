const express = require("express");
const cors = require("cors");
const routes = require("./routes/transcode-route");

const app = express();

app.use(
  cors({
    allowedHeaders: ["*"],
    origin: "*",
  })
);

app.use("/api/v1", routes);

app.listen(process.env.PORT || 4000, () => {
  console.log(`App listening on PORT : ${process.env.PORT}`);
});
