import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    firstName: String,
    lastName: String,
    phone: String,
    city: String,
    country: String,
    profilePicture: {
      type: String,
      default: null
    }
  },
  { collection: "applicants" }
);

const Applicant = mongoose.model("Applicant", applicantSchema);
export default Applicant;
