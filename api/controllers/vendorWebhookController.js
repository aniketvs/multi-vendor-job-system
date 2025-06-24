const cleanResult = require("../../common/cleanResult");
const Job = require("../model/job");

exports.vendorWebhook = async (req, res) => {
  try {
    const { request_id, result } = req.body;

    if (!request_id || !result) {
      return res.status(400).json({ error: "Missing request_id or result" });
    }

    const job = await Job.findOne({ request_id });

    if (!job) {
      return res.status(404).json({ status: 'failed', error: "Job not found" });
    }

    if (job.status.toLowerCase() === 'complete') {
      return res.status(200).json({ status: 'success', message: 'Job already completed' });
    }


    job.status = "complete";
    job.result = result?.payload;
    await job.save();
    return res.json({ status: "success" });
  } catch (err) {
    console.error("Error in webhook:", err);
    return res.status(500).json({ status: 'failed', error: "Internal Server Error" });
  }
};
