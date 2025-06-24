const express = require("express");
const connectDB = require("./config/db");
const { initProducer } = require("./services/kafka");
require("dotenv").config({ path: "/app/api/.env" });
const app = express();

app.use(express.json());

app.use("/", require('./routes/router'));


const PORT = process.env.API_PORT || 3000;
(async () => {
  await connectDB();
  await initProducer();

  app.listen(PORT, () => {
    console.log(`API service running on port ${PORT}`);
  });
})();
