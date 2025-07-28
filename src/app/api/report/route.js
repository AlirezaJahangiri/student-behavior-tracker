import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Types } from "mongoose";
import crypto from "crypto";

import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import Teacher from "@/models/Teacher";
import { encryptData, decryptData } from "@/utils/encrypt";

// نرمال‌سازی ورودی (حذف فاصله‌ها و تبدیل به حروف کوچک)
function normalize(input) {
  return input?.trim().replace(/\s+/g, " ").toLowerCase();
}

// هش کردن کلید نرمال‌شده
function hashKey(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function GET() {
  try {
    await connectDB();
    const teachers = await Teacher.find({ published: true }).select("-userId");

    const decryptedTeachers = teachers.map((teacher) => {
      const plain = teacher.toObject();
      return {
        ...plain,
        teacherName: decryptData(plain.teacherName),
        fatherName: decryptData(plain.fatherName),
        descriptions: plain.descriptions.map((desc) => ({
          ...desc,
          text: decryptData(desc.text),
          date: desc.date,
        })),
      };
    });

    return NextResponse.json({ data: decryptedTeachers }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "مشکلی در سرور رخ داده است" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { fatherName, teacherName, descriptions = [] } = await req.json();

    if (!fatherName?.trim() || !teacherName?.trim()) {
      return NextResponse.json(
        { error: "لطفا همه فیلدها را به درستی پر کنید" },
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

    const rawKey = `${normalize(fatherName)}::${normalize(teacherName)}`;
    const normalizedKey = hashKey(rawKey);

    const existingTeacher = await Teacher.findOne({
      userId: user._id,
      normalizedKey,
    });

    if (existingTeacher) {
      return NextResponse.json(
        { error: "این مورد قبلاً ثبت شده است" },
        { status: 409 }
      );
    }

    const encryptedFatherName = encryptData(fatherName);
    const encryptedTeacherName = encryptData(teacherName);

    const cleanedDescriptions = descriptions
      .filter((item) => item?.text?.trim() && item?.date)
      .map((item) => ({
        text: encryptData(item.text),
        date: item.date,
      }));

    await Teacher.create({
      fatherName: encryptedFatherName,
      teacherName: encryptedTeacherName,
      normalizedKey,
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

export async function PATCH(req) {
  try {
    await connectDB();
    const {
      _id,
      fatherName,
      teacherName,
      descriptions = [],
    } = await req.json();

    if (!fatherName?.trim() || !teacherName?.trim()) {
      return NextResponse.json(
        { error: "لطفا همه فیلدها را به درستی پر کنید" },
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

    const rawKey = `${normalize(fatherName)}::${normalize(teacherName)}`;
    const normalizedKey = hashKey(rawKey);

    const duplicate = await Teacher.findOne({
      _id: { $ne: _id },
      userId: user._id,
      normalizedKey,
    });

    if (duplicate) {
      return NextResponse.json(
        { error: "این مشخصات قبلاً در یک مورد دیگر استفاده شده است" },
        { status: 409 }
      );
    }

    teacher.fatherName = encryptData(fatherName);
    teacher.teacherName = encryptData(teacherName);
    teacher.normalizedKey = normalizedKey;
    teacher.descriptions = descriptions
      .filter((item) => item?.text?.trim() && item?.date)
      .map((item) => ({
        text: encryptData(item.text),
        date: item.date,
      }));

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
