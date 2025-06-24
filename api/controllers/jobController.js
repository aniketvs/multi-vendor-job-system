const { v4: uuidv4 } = require("uuid");
const Job = require("../model/job");
const { sendJobToQueue } = require("../services/kafka");

exports.createJob = async (req, res) => {
  try {
const vendor = req.query.vendor || "mock-async-vendor";
    const request_id = uuidv4();
    const payload = req.body;

    const job = new Job({ request_id, payload });
    await job.save();

    await sendJobToQueue('job-request',{ request_id, payload,vendor });

    res.status(200).json({status:'success', request_id });
  } catch (err) {
    console.error("Failed to create job:", err);
    res.status(500).json({status:'failed' ,error: "Internal Server Error" });
  }
};


exports.getJobStatus = async (req, res) => {
  try {
    const { request_id } = req.params;

    const job = await Job.findOne({ request_id });

    if (!job) {
      return res.status(404).json({ status:'failed',error: "Job not found" });
    }

    if (job.status === "complete") {
      return res.json({ status: "complete", result: job.result });
    }

    return res.json({ status: job.status || "processing" });
  } catch (err) {
    console.error("Error fetching job:", err);
    res.status(500).json({ status:'failed',error: "Internal Server Error" });
  }
};