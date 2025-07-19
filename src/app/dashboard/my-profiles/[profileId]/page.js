import connectDB from "@/utils/connectDB";
import Profile from "@/models/Profile";
import AddProfilePage from "@/templates/AddProfilePage";

export default async function Edit({ params }) {
  await connectDB();

  const { profileId } = await params;

  // اگر profileId نبود، ارور برگردون
  if (!profileId) {
    return <h3>شناسه پروفایل نامعتبر است</h3>;
  }

  const profile = await Profile.findById(profileId).lean();

  if (!profile) {
    return <h3>موردی یافت نشد</h3>;
  }

  // پاکسازی فیلدهای غیرقابل‌ارسال به کلاینت
  const safeProfile = {
    ...profile,
    _id: profile._id.toString(),
    userId: profile.userId.toString(),
    createdAt: new Date(profile.createdAt).toISOString(),
    updatedAt: new Date(profile.updatedAt).toISOString(),
    encouragements: profile.encouragements.map((item) => ({
      ...item,
      _id: item._id.toString?.() || "",
      date: new Date(item.date).toISOString(),
    })),
    punishments: profile.punishments.map((item) => ({
      ...item,
      _id: item._id.toString?.() || "",
      date: new Date(item.date).toISOString(),
    })),
  };

  return <AddProfilePage data={safeProfile} />;
}
