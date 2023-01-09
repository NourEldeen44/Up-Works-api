const express = require("express");
const jobsRoutes = require("./jobs");
const ProposalsRoutes = require("./proposals");
const router = express.Router();

//jobs
router.use("/", jobsRoutes);
//job proposals
router.use("/:job_id/proposals", ProposalsRoutes);

module.exports = router;
