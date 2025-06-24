const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  request_id: String,
  payload: Object,
  status: { type: String, enum: ["pending", "processing", "complete", "failed"], default: "pending" },
  result: Object,
});

module.exports = mongoose.model("Job", JobSchema);
