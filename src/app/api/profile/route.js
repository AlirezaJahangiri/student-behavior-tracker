import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Types } from "mongoose";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import Profile from "@/models/Profile";

// GET: دریافت همه پروفایل‌های منتشر شده
export async function GET() {
  try {
    await connectDB();
    const profiles = await Profile.find({ published: true }).select("-userId");
    return NextResponse.json({ data: profiles }, { status: 200 });
  } catch (error) {
    console.error(error);
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

    if (!classNumber || !nationalId || !studentName) {
      return NextResponse.json(
        { error: "لطفا همه فیلدها را تکمیل کنید" },
        { status: 400 }
      );
    }

    const session = await getServerSession(req);
    if (!session) {
      return NextResponse.json(
        { error: "لطفا ابتدا وارد حساب کاربری شوید" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    const existingProfile = await Profile.findOne({
      userId: user._id,
      nationalId,
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "این مورد قبلاً ثبت شده است" },
        { status: 409 }
      );
    }

    const cleanedEncouragements = encouragements.filter(
      (item) => item?.text?.trim() && item?.date
    );

    const cleanedPunishments = punishments.filter(
      (item) => item?.text?.trim() && item?.date
    );

    await Profile.create({
      classNumber,
      nationalId,
      studentName,
      encouragements: cleanedEncouragements,
      punishments: cleanedPunishments,
      userId: new Types.ObjectId(user._id),
    });

    return NextResponse.json(
      { message: "مورد انضباطی با موفقیت ثبت شد" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "خطای سرور. لطفاً بعداً تلاش کنید" },
      { status: 500 }
    );
  }
}

// PATCH: ویرایش پروفایل
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

    if (!_id || !classNumber || !nationalId || !studentName) {
      return NextResponse.json(
        { error: "لطفا همه فیلدها را تکمیل کنید" },
        { status: 400 }
      );
    }

    const session = await getServerSession(req);
    if (!session) {
      return NextResponse.json(
        { error: "ابتدا وارد حساب کاربری شوید" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    const profile = await Profile.findById(_id);
    if (!profile) {
      return NextResponse.json(
        { error: "پروفایل مورد نظر پیدا نشد" },
        { status: 404 }
      );
    }

    if (!user._id.equals(profile.userId)) {
      return NextResponse.json(
        { error: "شما مجاز به ویرایش این مورد نیستید" },
        { status: 403 }
      );
    }

    // بررسی تکراری بودن nationalId برای سایر پروفایل‌ها
    const duplicate = await Profile.findOne({
      _id: { $ne: _id },
      userId: user._id,
      nationalId,
    });

    if (duplicate) {
      return NextResponse.json(
        { error: "این کد ملی قبلاً در یک مورد دیگر استفاده شده است" },
        { status: 409 }
      );
    }

    profile.classNumber = classNumber;
    profile.nationalId = nationalId;
    profile.studentName = studentName;
    profile.encouragements = encouragements.filter(
      (item) => item?.text?.trim() && item?.date
    );
    profile.punishments = punishments.filter(
      (item) => item?.text?.trim() && item?.date
    );

    await profile.save();

    return NextResponse.json(
      { message: "ویرایش با موفقیت انجام شد" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "مشکلی در سرور رخ داده است" },
      { status: 500 }
    );
  }
}
