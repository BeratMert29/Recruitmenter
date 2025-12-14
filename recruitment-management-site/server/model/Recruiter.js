import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    companyName: String,
    contactName: String,
    phone: String,
    city: String,
    country: String,
    profilePicture: {
      type: String,
      default: null
    }
  },
  { collection: "recruiters" }
);

const Recruiter = mongoose.model("Recruiter", recruiterSchema);
export default Recruiter;
