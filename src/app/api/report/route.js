import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Types } from "mongoose";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import Teacher from "@/models/Teacher";

// GET: دریافت همه پروفایل‌های منتشر شده
export async function GET() {
  try {
    await connectDB();
    const Teachers = await Teacher.find({ published: true }).select("-userId");
    return NextResponse.json({ data: Teachers }, { status: 200 });
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

    const { nationalId, teacherName, descriptions = [] } = await req.json();

    if (!nationalId || !teacherName) {
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

    const existingTeacher = await Teacher.findOne({
      userId: user._id,
      nationalId,
    });

    if (existingTeacher) {
      return NextResponse.json(
        { error: "این مورد قبلاً ثبت شده است" },
        { status: 409 }
      );
    }

    const cleanedDescriptions = descriptions.filter(
      (item) => item?.text?.trim() && item?.date
    );

    await Teacher.create({
      nationalId,
      teacherName,
      descriptions: cleanedDescriptions,
      userId: new Types.ObjectId(user._id),
    });

    return NextResponse.json({ message: "با موفقیت ثبت شد" }, { status: 201 });
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
      nationalId,
      teacherName,
      descriptions = [],
    } = await req.json();

    if (!_id || !nationalId || !teacherName) {
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

    const teacher = await Teacher.findById(_id);
    if (!teacher) {
      return NextResponse.json(
        { error: "پروفایل مورد نظر پیدا نشد" },
        { status: 404 }
      );
    }

    if (!user._id.equals(teacher.userId)) {
      return NextResponse.json(
        { error: "شما مجاز به ویرایش این مورد نیستید" },
        { status: 403 }
      );
    }

    // بررسی تکراری بودن nationalId برای سایر پروفایل‌ها
    const duplicate = await Teacher.findOne({
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

    teacher.nationalId = nationalId;
    teacher.teacherName = teacherName;
    teacher.descriptions = descriptions.filter(
      (item) => item?.text?.trim() && item?.date
    );

    await teacher.save();

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
