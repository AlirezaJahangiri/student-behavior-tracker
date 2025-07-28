import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import MyTeacherProfilePage from "@/templates/MyTeacherProfilePage";
import { decryptData } from "@/utils/encrypt";

async function Myteachers() {
  await connectDB();
  const session = await getServerSession(authOptions);

  const [user] = await User.aggregate([
    { $match: { email: session.user.email } },
    {
      $lookup: {
        from: "teachers",
        foreignField: "userId",
        localField: "_id",
        as: "teachers",
      },
    },
  ]);

  const plainTeachers = user.teachers.map((teacher) => ({
    ...teacher,
    _id: teacher._id.toString(),
    userId: teacher.userId.toString(),
    createdAt: new Date(teacher.createdAt).toISOString(),
    updatedAt: new Date(teacher.updatedAt).toISOString(),
    teacherName: decryptData(teacher.teacherName),
    fatherName: decryptData(teacher.fatherName),
    descriptions: teacher.descriptions.map((desc) => ({
      ...desc,
      _id: desc._id?.toString(),
      date: new Date(desc.date).toISOString(),
      text: decryptData(desc.text),
    })),
  }));

  return <MyTeacherProfilePage teachers={plainTeachers} />;
}

export default Myteachers;
