const express = require("express");
const {
  getJobs,
  getSingleJob,
  updateJob,
  createJob,
  deleteJob,
} = require("../../controllers/jobs");
const router = express.Router();

router.get("/", getJobs);
router.get("/:id", getSingleJob);
router.post("/", createJob);
router.patch("/:id", updateJob);
router.delete("/:id", deleteJob);

module.exports = router;
