require('dotenv').config({path:'/app/api/.env'})
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
