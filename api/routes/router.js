const express = require("express");
const router = express.Router();
const { createJob } = require("../controllers/jobController");

router.post("/jobs", createJob);

module.exports = router;
