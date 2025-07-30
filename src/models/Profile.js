import { Schema, model, models } from "mongoose";

const profileSchema = new Schema(
  {
    classNumber: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },

    normalizedKey: {
      type: String,
      required: true,
      index: true,
    },

    encouragements: {
      type: [
        {
          text: { type: String, required: true },
          date: { type: Date, required: true },
        },
      ],
      default: [],
    },
    punishments: {
      type: [
        {
          text: { type: String, required: true },
          date: { type: Date, required: true },
        },
      ],
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
