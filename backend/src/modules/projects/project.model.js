import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // NEW
    projectKey: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    // NEW
    taskSequence: {
      type: Number,
      default: 0,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
      },
    ],

    status: {
      type: String,
      enum: ["Active", "Completed", "Archived"],
      default: "Active",
    },

    startDate: Date,

    endDate: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", projectSchema);