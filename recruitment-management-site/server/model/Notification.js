import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    reason: { type: String },
    jobTitle: { type: String },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "notifications" }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
