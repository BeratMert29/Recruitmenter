import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    details: String,
    location: String,
    jobType: {
      type: String,
      enum: ["full_time", "part_time", "internship", "contract"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deadline: Date,
  },
  {
    collection: "jobs",
    timestamps: true,      // <-- createdAt ve updatedAt otomatik gelecek
  }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
