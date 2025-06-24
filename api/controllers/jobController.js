const { v4: uuidv4 } = require("uuid");
const Job = require("../model/job");
const { sendJobToQueue } = require("../services/kafka");

exports.createJob = async (req, res) => {
  try {
    const request_id = uuidv4();
    const payload = req.body;

    const job = new Job({ request_id, payload });
    await job.save();

    await sendJobToQueue('job-request',{ request_id, payload });

    res.status(200).json({status:'success', request_id });
  } catch (err) {
    console.error("Failed to create job:", err);
    res.status(500).json({status:'failed' ,error: "Internal Server Error" });
  }
};
