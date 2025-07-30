import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import MyProfilesPage from "@/templates/MyProfilesPage";
import { decryptData } from "@/utils/encrypt";

async function MyProfiles() {
  await connectDB();
  const session = await getServerSession(authOptions);

  const [user] = await User.aggregate([
    { $match: { email: session.user.email } },
    {
      $lookup: {
        from: "profiles",
        foreignField: "userId",
        localField: "_id",
        as: "profiles",
      },
    },
  ]);

  const plainProfles = user.profiles.map((profile) => ({
    ...profile,
    _id: profile._id.toString(),
    userId: profile.userId.toString(),
    createdAt: new Date(profile.createdAt).toISOString(),
    updatedAt: new Date(profile.updatedAt).toISOString(),
    studentName: decryptData(profile.studentName),
    fatherName: decryptData(profile.fatherName),
    classNumber: decryptData(profile.classNumber),
    punishments: profile.punishments.map((punishment) => ({
      ...punishment,
      _id: punishment._id?.toString(),
      date: new Date(punishment.date).toISOString(),
      text: decryptData(punishment.text),
    })),

    encouragements: profile.encouragements.map((encouragement) => ({
      ...encouragement,
      _id: encouragement._id?.toString(),
      date: new Date(encouragement.date).toISOString(),
      text: decryptData(encouragement.text),
    })),
  }));

  return <MyProfilesPage profiles={plainProfles} />;
}

export default MyProfiles;
