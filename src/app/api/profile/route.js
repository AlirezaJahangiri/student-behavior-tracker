import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Types } from "mongoose";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import Profile from "@/models/Profile";

// GET: دریافت همه پروفایل‌ها
export async function GET() {
  try {
    await connectDB();
    const profiles = await Profile.find({ published: true }).select("-userId");
    return NextResponse.json({ data: profiles }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "مشکلی در سرور رخ داده است" },
      { status: 500 }
    );
  }
}

// POST: ایجاد پروفایل جدید
export async function POST(req) {
  try {
    await connectDB();

    const {
      classNumber,
      nationalId,
      studentName,
      encouragements = [],
      punishments = [],
    } = await req.json();

    const session = await getServerSession(req);
    if (!session) {
      return NextResponse.json(
        { error: "لطفا وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: "حساب کاربری یافت نشد" },
        { status: 404 }
      );
    }

    if (!classNumber || !nationalId || !studentName) {
      return NextResponse.json(
        { error: "لطفا اطلاعات معتبر وارد کنید" },
        { status: 400 }
      );
    }

    // فیلتر موارد ناقص
    const cleanedEncouragements = encouragements.filter(
      (item) => item?.text?.trim() && item?.date
    );
    const cleanedPunishments = punishments.filter(
      (item) => item?.text?.trim() && item?.date
    );

    const newProfile = await Profile.create({
      classNumber,
      nationalId,
      studentName,
      encouragements: cleanedEncouragements,
      punishments: cleanedPunishments,
      userId: new Types.ObjectId(user._id),
    });

    return NextResponse.json(
      { message: "مورد انضباطی جدید اضافه شد" },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "مشکلی در سرور رخ داده است" },
      { status: 500 }
    );
  }
}

// PATCH: ویرایش پروفایل موجود
export async function PATCH(req) {
  try {
    await connectDB();

    const {
      _id,
      classNumber,
      nationalId,
      studentName,
      encouragements = [],
      punishments = [],
    } = await req.json();

    const session = await getServerSession(req);
    if (!session) {
      return NextResponse.json(
        { error: "لطفا وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: "حساب کاربری یافت نشد" },
        { status: 404 }
      );
    }

    if (!classNumber || !nationalId || !studentName || !_id) {
      return NextResponse.json(
        { error: "لطفا اطلاعات معتبر وارد کنید" },
        { status: 400 }
      );
    }

    const profile = await Profile.findById(_id);
    if (!profile) {
      return NextResponse.json({ error: "پروفایل یافت نشد" }, { status: 404 });
    }
    if (!user._id.equals(profile.userId)) {
      return NextResponse.json(
        { error: "دسترسی شما محدود شده است" },
        { status: 403 }
      );
    }

    // فیلتر موارد ناقص
    const cleanedEncouragements = encouragements.filter(
      (item) => item?.text?.trim() && item?.date
    );
    const cleanedPunishments = punishments.filter(
      (item) => item?.text?.trim() && item?.date
    );

    profile.classNumber = classNumber;
    profile.nationalId = nationalId;
    profile.studentName = studentName;
    profile.encouragements = cleanedEncouragements;
    profile.punishments = cleanedPunishments;

    await profile.save();

    return NextResponse.json(
      { message: "مورد انضباطی با موفقیت ویرایش شد" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "مشکلی در سرور رخ داده است" },
      { status: 500 }
    );
  }
}
