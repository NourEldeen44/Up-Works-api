const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const User = require("../models/User");
const Job = require("../models/Job");
const Proposal = require("../models/Proposal");

const getJobs = async (req, res) => {
  //get all client's jobs
  const userStatus = req.user.status;
  let jobs = [];
  let jobsCount = 0;
  let pageLimit = 10;
  let jobPage = 1;
  if (userStatus == "client") {
    const createdBy = req.user.id;
    jobs = await Job.find({ createdBy }).sort("-updatedAt");
    jobsCount = await Job.countDocuments({ createdBy });
  }

  //get freelancer feed
  if (userStatus == "freelancer") {
    const { search, page, limit, numericFilters } = req.query;
    let queryObj = {};
    let skills = req.query.skills;
    //skills
    if (!skills) {
      const user = await User.findById(req.user.id);
      if (!user) {
        throw new NotFoundError(`No User Found with id ${req.user.id}`);
      }
      skills = user.skills.join(",");
      const skillList = skills.split(",");
      queryObj.skills = {
        $in: skillList.map((skill) => {
          return new RegExp(skill, "gi");
        }),
      };
    } else {
      const skillList = skills.split(",");
      queryObj.skills = {
        $all: skillList.map((skill) => {
          return new RegExp(skill, "gi");
        }),
      };
    }

    if (search) {
      //emptying skills from query obj to search normally if search is provided
      // not to search with normal search and skill search together
      queryObj = {};
      const trimmedSearch = search.trim();
      queryObj.$or = [
        { title: { $regex: trimmedSearch, $options: "mi" } },
        { description: { $regex: trimmedSearch, $options: "mi" } },
        { skills: { $regex: trimmedSearch, $options: "mi" } },
      ];
      // queryObj.$text = { $search: { $regex: search, $options: "gi" } };
    }
    //numeric filters
    if (numericFilters) {
      const operatorMap = {
        "<": "$lt",
        "<=": "$lte",
        ">": "$gt",
        ">=": "$gte",
      };
      const regex = /\b(<|<=|>|>=)\b/g;
      const filters = numericFilters.replace(regex, function (match) {
        return `-${operatorMap[match]}-`;
      });
      filters.split(",").map((item) => {
        const [field, operator, value] = item.split("-");
        queryObj[field] = { [operator]: Number(value) };
      });
    }
    const result = Job.find(queryObj);
    //sort
    const sort = req.query.sort || "-createdAt";
    const sortList = sort.split(",").join(" ");
    result.sort(sortList);
    //select
    const select = req.query.select;
    if (select) {
      const selectList = select.split(",").join(" ");
      result.select(selectList);
    }
    //pagination
    jobPage = Number(page) || 1;
    pageLimit = Number(limit) || 10;
    const pageSkip = pageLimit * (jobPage - 1);
    result.skip(pageSkip).limit(pageLimit);
    jobs = await result;
    jobsCount = await Job.countDocuments(queryObj);
  }
  const pages = Math.ceil(Number(jobsCount) / pageLimit) || 1;
  res.status(StatusCodes.OK).json({ jobs, count: jobsCount, pages });
};
const getSingleJob = async (req, res) => {
  const jobID = req.params.id;
  const job = await Job.findById(jobID);
  if (!job) {
    throw new NotFoundError(`No Job Foun with id ${jobID}`);
  }
  res.status(StatusCodes.OK).json({ job });
};
const createJob = async (req, res) => {
  const { title, description, skills } = req.body;
  if (!title || !description || !skills) {
    throw new BadRequestError("Please Provide Title & Description & Skills");
  }
  const skillsList = skills.split(",");
  const jobData = { title, description, skills: skillsList };
  jobData.createdBy = req.user.id;
  if (req.body.numsOfFreelancers) {
    jobData.numsOfFreelancers = Number(req.body.numsOfFreelancers);
  }
  if (req.body.price) {
    jobData.price = Number(req.body.price);
  }
  const job = await Job.create(jobData);

  res
    .status(StatusCodes.OK)
    .json({ msg: "job created successfuly", success: true, job });
};

const updateJob = async (req, res) => {
  const { title, description, skills, numsOfFreelancers } = req.body;
  const jobID = req.params.id;
  const skillsList = skills.split(",");
  const jobData = { title, description, skills: skillsList, numsOfFreelancers };
  const updatedJob = await Job.findByIdAndUpdate(jobID, jobData, { new: true });

  res
    .status(StatusCodes.OK)
    .json({ msg: "job updated successfuly", success: true, updatedJob });
};
const deleteJob = async (req, res) => {
  const jobID = req.params.id;
  const deletedJob = await Job.findByIdAndDelete(jobID);
  if (!deletedJob) {
    throw new NotFoundError(`No Job Found with id ${jobID}`);
  }
  //delete job's proposals
  const deletedJobProposals = await Proposal.deleteMany({ job_id: jobID });
  res
    .status(StatusCodes.OK)
    .json({ msg: "job deleted successfuly", success: true });
};
module.exports = { getJobs, getSingleJob, createJob, updateJob, deleteJob };
