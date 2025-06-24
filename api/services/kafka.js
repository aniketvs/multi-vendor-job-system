const { Kafka } = require("kafkajs");
require('dotenv').config();

const kafka = new Kafka({
  clientId: "api-service",
  brokers: [ "kafka:9092"],
}); 

const producer = kafka.producer();

async function initProducer() {
  try {
    await producer.connect();
    console.log("Kafka producer connected");
  } catch (err) {
    console.error("Failed to connect Kafka producer:", err);
    process.exit(1); // optional: crash if producer can't start
  }
}


async function sendJobToQueue(topic,job) {
  await producer.send({
    topic: topic,
    messages: [{ value: JSON.stringify(job) }],
  });
}

module.exports = { initProducer, sendJobToQueue };
