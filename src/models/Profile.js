import { Schema, model, models } from "mongoose";

const profileSchema = new Schema(
  {
    classNumber: {
      type: String,
      required: true,
    },
    nationalId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },

    registeredAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    category: {
      type: String,
      enum: ["تنبیهی", "تشویقی"],
      required: true,
    },
    additionalDescription: {
      type: [String],
      default: [],
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Profile = models.Profile || model("Profile", profileSchema);

export default Profile;
