const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} = require("../errors");
const Proposal = require("../models/Proposal");
const Job = require("../models/Job");

const getJobProposals = async (req, res) => {
  const { job_id } = req.params;
  const proposals = await Proposal.find({ job_id }).sort("-createdAt");
  res.status(StatusCodes.OK).json({ proposals, count: proposals.length });
};
const getSingleProposal = async (req, res) => {
  const { id } = req.params;
  const proposal = await Proposal.findById(id);
  if (!proposal) {
    throw new NotFoundError(`No Proposal Found with id ${id}`);
  }
  res.status(StatusCodes.OK).json({ proposal });
};
const getFreelancerProposal = async (req, res) => {
  const { job_id } = req.params;
  const { id: user_id } = req.user;
  const proposalData = { createdBy: user_id, job_id };
  const proposal = await Proposal.findOne(proposalData);
  if (!proposal) {
    throw new NotFoundError(
      `No Proposal Found in this job with for this freelancer`
    );
  }
  res.status(StatusCodes.OK).json({ proposal });
};

const createProposal = async (req, res) => {
  const { id: user_id, username } = req.user;
  const { job_id } = req.params;
  const { content } = req.body;
  if (!content) {
    throw new BadRequestError(
      'Please Provide Proposal Content as {"content":"some text"}'
    );
  }
  const job = await Job.findById(job_id);
  if (!job) {
    throw new NotFoundError(`No Job Found with id ${job_id}`);
  }
  const proposalData = {
    createdBy: user_id,
    job_id,
    content,
    freelancerName: username,
  };
  const checkProposalExistance = await Proposal.findOne({
    createdBy: user_id,
    job_id,
  });
  if (checkProposalExistance) {
    throw new UnAuthorizedError("Un Authorized to Post more than one Proposal");
  }
  const proposal = await Proposal.create({ ...proposalData });
  await Job.findByIdAndUpdate(job_id, {
    numsOfProposals: Number(job.numsOfProposals) + 1,
  });
  res.status(StatusCodes.OK).json({
    msg: "Proposal created and sent successfuly",
    success: true,
    proposal,
  });
};
const updateProposal = async (req, res) => {
  const { id } = req.params;
  const { viewd, content } = req.body;
  if (!viewd || viewd == "false") {
    throw new BadRequestError(
      `please provide viewd value of boolean equals to true`
    );
  }
  const updatedProposal = await Proposal.findByIdAndUpdate(
    id,
    { viewd: true, content },
    { new: true }
  );
  if (!updatedProposal) {
    throw new NotFoundError(`No Proposal Found with id ${id}`);
  }
  res.status(StatusCodes.OK).json({
    msg: "proposal updated successfuly",
    succes: true,
    updatedProposal,
  });
};
const deleteProposal = async (req, res) => {
  const { id } = req.params;
  const deletedProposal = await Proposal.findByIdAndDelete(id);
  if (!deletedProposal) {
    throw new NotFoundError(`No Proposal Found with id ${id}`);
  }
  const job = await Job.findById(deletedProposal.job_id);
  await Job.findByIdAndUpdate(deletedProposal.job_id, {
    numsOfProposals: Number(job.numsOfProposals) + 1,
  });
  res
    .status(StatusCodes.OK)
    .json({ msg: `proposal deleted successfuly`, success: true });
};
const deleteJobProposals = async (req, res) => {
  const { job_id } = req.params;
  const deletedProposals = await Proposal.deleteMany({ job_id });
  if (!deletedProposals) {
    throw new NotFoundError(
      `No Proposal Found for this Job or Job has been deleted`
    );
  }
  res.status(StatusCodes.OK).json({
    msg: `All Proposals Of The Job deleted successfully`,
    success: true,
  });
};
module.exports = {
  getJobProposals,
  getSingleProposal,
  getFreelancerProposal,
  createProposal,
  deleteProposal,
  updateProposal,
  deleteJobProposals,
};
