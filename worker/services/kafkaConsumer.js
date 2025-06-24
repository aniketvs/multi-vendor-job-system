const { Kafka } = require("kafkajs");
const axios = require("axios");
const Job = require("../model/job");
const cleanResult = require("../../common/cleanResult");
const vendorFlow = require("./vendorCaller");

const kafka = new Kafka({
  clientId: "worker",
  brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "job-worker-group" });

async function startKafkaConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "job-request", fromBeginning: false });

  console.log(" Worker is running and listening for jobs...");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const { request_id, payload, vendor } = JSON.parse(message.value.toString());

      console.log(`Received job: ${request_id}, Vendor: ${vendor}`);

      const job = await Job.findOne({ request_id });
      if (!job) return;

      job.status = "processing";
      await job.save();

      const flow = vendorFlow[vendor] || "async";

    
    },
  });
}

module.exports = startKafkaConsumer;
