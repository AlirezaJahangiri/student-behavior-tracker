import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import MyProfilesPage from "@/templates/MyProfilesPage";

async function Myprofiles() {
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
  // 👇 تبدیل ObjectId و Date به string برای ارسال به کامپوننت کلاینت
  const plainProfiles = user.profiles.map((profile) => ({
    ...profile,
    _id: profile._id.toString(),
    userId: profile.userId.toString(),
    registeredAt: new Date(profile.registeredAt).toISOString(),
    createdAt: new Date(profile.createdAt).toISOString(),
    updatedAt: new Date(profile.updatedAt).toISOString(),
  }));

  return <MyProfilesPage profiles={plainProfiles} />;
}

export default Myprofiles;
