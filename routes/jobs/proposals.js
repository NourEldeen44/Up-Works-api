const express = require("express");
const clientAuth = require("../../middleware/clientAuth");
const freelancerAuth = require("../../middleware/freelancerAuth");
const {
  getJobProposals,
  getSingleProposal,
  createProposal,
  deleteProposal,
  updateProposal,
  deleteJobProposals,
  getFreelancerProposal,
} = require("../../controllers/proposals");
const router = express.Router({ mergeParams: true });
router.get("/", clientAuth, getJobProposals);
router.get("/prop/:id", getSingleProposal);
router.get("/checkProp", getFreelancerProposal);
router.post("/", freelancerAuth, createProposal);
router.patch("/:id", clientAuth, updateProposal);
router.delete("/:id", freelancerAuth, deleteProposal);
router.delete("/", clientAuth, deleteJobProposals);
module.exports = router;
