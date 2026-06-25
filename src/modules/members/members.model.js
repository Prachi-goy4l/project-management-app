import mongoose from "mongoose";
const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },

    role: {
      type: String,
      enum: ["Owner", "Admin", "Member"],
      default: "Member",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Member", memberSchema);