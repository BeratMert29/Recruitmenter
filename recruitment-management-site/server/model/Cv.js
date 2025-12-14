import mongoose from "mongoose";

const cvSchema = new mongoose.Schema(
  {
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Applicant",
      required: true,
    },
    fullName: String,
    birthDate: String,
    maritalStatus: String,
    educationStatus: String,
    schoolName: String,
    certificates: String,
    experience: [{
      company: String,
      position: String,
      startDate: String,
      endDate: String,
      description: String
    }],
    cvDocument: {
      type: String,
      default: null
    },
    certificateFiles: [{
      type: String
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { 
    collection: "cvs",
    timestamps: true
  }
);

const Cv = mongoose.model("Cv", cvSchema);
export default Cv;
