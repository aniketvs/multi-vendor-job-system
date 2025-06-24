const { Kafka } = require("kafkajs");
const axios = require("axios");
const Job = require("../model/job");
const cleanResult = require("../../common/cleanResult");
const vendorFlow = require("./vendorCaller");
const CentralRateLimiter = require("./rateLimiter");

const kafka = new Kafka({
  clientId: "worker",
  brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
});


const consumer = kafka.consumer({ groupId: "job-worker-group" });

const globalLimiter = new CentralRateLimiter(50, 1000);

async function startKafkaConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "job-request", fromBeginning: false });

  console.log(" Worker is running and listening for jobs...");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const { request_id, payload, vendor } = JSON.parse(message.value.toString());
        const flow = vendorFlow[vendor] || "async";
        console.log(` Received job: ${request_id}, Vendor: ${vendor}`);


        await globalLimiter.acquire(flow === 'sync' ? 2 : 1);

        const job = await Job.findOne({ request_id });
        if (!job) {
          console.warn(`Job not found in DB: ${request_id}`);
          return;
        }


        job.status = "processing";
        await job.save();


        const vendorHost = vendor === "mock-sync-vendor" ? "vendor-sync" : "vendor-async";
        if (flow === "sync") {

          const response = await axios.post(`http://${vendorHost}:4001/vendor`, {
            request_id,
            payload
          });

          if (response.data.status === "success") {
            const result = response.data.result;

            job.status = "complete";
            job.result = result.payload;
            await job.save();
            console.log(`Job complete (sync): ${request_id}`);
          } else {
            job.status = "failed";
            await job.save();
            console.error(`Vendor sync failed: ${request_id}`);
          }
        } else {
          try {
            await axios.post(`http://${vendorHost}:4002/vendor`, { request_id, payload });
            console.log(` Async job ${request_id} forwarded to ${vendor}`);
          } catch (err) {
            job.status = "failed";
            await job.save();
            console.error(` Async vendor call failed:`, err.message);
          }

        }
      } catch (err) {
        console.error("Worker failed to process job:", err);
      }
    }
  });
}

module.exports = startKafkaConsumer;
