require("dotenv").config();
const connectDB = require("./config/db");
const startKafkaConsumer = require("./services/kafkaConsumer");

async function start() {
  await connectDB();
  await startKafkaConsumer();
}

start().catch((err) => {
  console.error(" Worker failed to start:", err);
  process.exit(1);
});
