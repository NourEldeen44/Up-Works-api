const { Schema, Types, model } = require("mongoose");
const JobSchema = new Schema(
  {
    createdBy: {
      type: Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please Provide Title"],
      minLength: 3,
      maxLength: 200,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please Provide Description"],
      minLength: 20,
      maxLength: 400,
      trim: true,
    },
    skills: {
      type: [String],
      validate: {
        validator: function (v) {
          if (1 <= v.length <= 5) {
            return true;
          } else {
            return false;
          }
        },
        message: "too much skills 5 skills max",
      },
      trim: true,
    },
    numsOfFreelancers: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
    numsOfProposals: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 5,
      min: 5,
      max: 1000,
    },
  },
  { timestamps: true }
);
JobSchema.index({ title: "text", description: "text", skills: "text" });
const Job = model("Job", JobSchema, "upworks-jobs");
Job.createIndexes();
module.exports = Job;
