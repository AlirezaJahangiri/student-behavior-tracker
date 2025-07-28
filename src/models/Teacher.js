import { Schema, model, models } from "mongoose";

const TeacherSchema = new Schema(
  {
    fatherName: {
      type: String,
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
    },

    normalizedKey: {
      type: String,
      required: true,
      index: true,
    },

    descriptions: {
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

const Teacher = models.Teacher || model("Teacher", TeacherSchema);

export default Teacher;
