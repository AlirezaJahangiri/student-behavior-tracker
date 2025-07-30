import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Types } from "mongoose";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import Profile from "@/models/Profile";
import crypto from "crypto";
import { encryptData, decryptData } from "@/utils/encrypt";

function normalize(input) {
  return input?.trim().replace(/\s+/g, " ").toLowerCase();
}

function hashKey(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function GET() {
  try {
    await connectDB();
    const profiles = await Profile.find({ published: true }).select("-userId");

    const decryptedProfiles = profiles.map((profile) => {
      const plain = profile.toObject();
      return {
        ...plain,
        studentName: decryptData(plain.studentName),
        fatherName: decryptData(plain.fatherName),
        classNumber: decryptData(plain.classNumber),
        encouragements: plain.encouragements.map((encouragement) => ({
          ...encouragement,
          text: decryptData(encouragement.text),
          date: encouragement.date,
        })),
        punishments: plain.punishments.map((punishment) => ({
          ...punishment,
          text: decryptData(punishment.text),
          date: punishment.date,
        })),
      };
    });

    return NextResponse.json({ data: decryptedProfiles }, { status: 200 });
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
    const {
      fatherName,
      classNumber,
      studentName,
      encouragements = [],
      punishments = [],
    } = await req.json();

    if (!fatherName?.trim() || !studentName?.trim() || !classNumber?.trim()) {
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

    const rawKey = `${normalize(studentName)}::${normalize(
      fatherName
    )}::${normalize(classNumber)}`;
    const normalizedKey = hashKey(rawKey);

    const existingProfile = await Profile.findOne({
      userId: user._id,
      normalizedKey,
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "این مورد قبلاً ثبت شده است" },
        { status: 409 }
      );
    }

    const encryptedFatherName = encryptData(fatherName);
    const encryptedStudentName = encryptData(studentName);
    const encryptedClassNumber = encryptData(classNumber);

    const cleanedPunishments = punishments
      .filter((item) => item?.text?.trim() && item?.date)
      .map((item) => ({
        text: encryptData(item.text),
        date: item.date,
      }));

    const cleanedEncouragements = encouragements
      .filter((item) => item?.text?.trim() && item?.date)
      .map((item) => ({
        text: encryptData(item.text),
        date: item.date,
      }));

    await Profile.create({
      fatherName: encryptedFatherName,
      studentName: encryptedStudentName,
      classNumber: encryptedClassNumber,
      normalizedKey,
      encouragements: cleanedEncouragements,
      punishments: cleanedPunishments,
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
      studentName,
      classNumber,
      punishments = [],
      encouragements = [],
    } = await req.json();

    if (!fatherName?.trim() || !studentName?.trim() || !classNumber?.trim()) {
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

    const rawKey = `${normalize(fatherName)}::${normalize(
      studentName
    )}::${normalize(classNumber)}`;
    const normalizedKey = hashKey(rawKey);

    const duplicate = await Profile.findOne({
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

    profile.fatherName = encryptData(fatherName);
    profile.studentName = encryptData(studentName);
    profile.classNumber = encryptData(classNumber);
    profile.normalizedKey = normalizedKey;
    profile.punishments = punishments
      .filter((item) => item?.text?.trim() && item?.date)
      .map((item) => ({
        text: encryptData(item.text),
        date: item.date,
      }));
    profile.encouragements = encouragements
      .filter((item) => item?.text?.trim() && item?.date)
      .map((item) => ({
        text: encryptData(item.text),
        date: item.date,
      }));

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
