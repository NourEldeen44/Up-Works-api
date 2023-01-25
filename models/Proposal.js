const { Schema, Types, model } = require("mongoose");
const ProposalSchema = new Schema(
  {
    createdBy: {
      type: Types.ObjectId,
      required: true,
    },
    job_id: {
      type: Types.ObjectId,
      required: true,
    },
    content: {
      type: String,
      required: [true, "please provide proposal content"],
      minLength: [
        20,
        "Too Short Proposal Content Please Provide more than 20 chars",
      ],
      maxLength: [
        400,
        "Too Long Proposal Content Please Provide less than 400 chars",
      ],
    },
    viewd: {
      type: Boolean,
      default: false,
    },
    freelancerName: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: true } }
);
const Proposal = model("Proposal", ProposalSchema, "upworks-proposals");
module.exports = Proposal;
