const express = require("express");
const router = express.Router();
const { createJob,getJobStatus } = require("../controllers/jobController");
const {vendorWebhook}=require('../controllers/vendorWebhookController');

router.post("/jobs", createJob);
router.get("/jobs/:request_id", getJobStatus);
router.post("/vendor-webhook/:vendor", vendorWebhook);
module.exports = router;
