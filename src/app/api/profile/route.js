import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Types } from "mongoose";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import Profile from "@/models/Profile";

export async function GET() {
  try {
    await connectDB();

    const profiles = await Profile.find({ published: true }).select("-userId");

    return NextResponse.json(
      {
        data: profiles,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
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
      classNumber,
      nationalId,
      description,
      studentName,
      registeredAt,
      category,
      additionalDescription,
    } = await req.json();

    const session = await getServerSession(req);
    if (!session) {
      return NextResponse.json(
        {
          error: "لطفا وارد حساب کاربری خود شوید",
        },
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

    if (
      !classNumber ||
      !nationalId ||
      !description ||
      !studentName ||
      !registeredAt ||
      !additionalDescription ||
      !category
    ) {
      return NextResponse.json(
        { error: "لطفا اطلاعات معتبر وارد کنید" },
        { status: 400 }
      );
    }

    const isExist = await Profile.findOne({
      nationalId,
      userId: user._id,
      category,
    });

    if (isExist) {
      return NextResponse.json(
        { error: `مورد ${category} برای این دانش‌آموز قبلاً ثبت شده است` },
        { status: 400 }
      );
    }

    const newProfile = await Profile.create({
      classNumber,
      nationalId,
      description,
      studentName,
      registeredAt,
      additionalDescription,
      category,
      userId: new Types.ObjectId(user._id),
    });
    console.log(newProfile);
    return NextResponse.json(
      { message: "مورد انضباطی جدید اضافه شد" },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "مشکلی در سرور رخ داده است" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    await connectDB();

    const {
      _id,
      classNumber,
      nationalId,
      description,
      studentName,
      registeredAt,
      category,
      additionalDescription,
    } = await req.json();

    const session = await getServerSession(req);
    if (!session) {
      return NextResponse.json(
        {
          error: "لطفا وارد حساب کاربری خود شوید",
        },
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

    if (
      !_id ||
      !classNumber ||
      !nationalId ||
      !description ||
      !studentName ||
      !registeredAt ||
      !additionalDescription ||
      !category
    ) {
      return NextResponse.json(
        { error: "لطفا اطلاعات معتبر وارد کنید" },
        { status: 400 }
      );
    }

    const profile = await Profile.findOne({ _id });
    if (!user._id.equals(profile.userId)) {
      return NextResponse.json(
        {
          error: "دسترسی شما به این بخش محدود شده است",
        },
        { status: 403 }
      );
    }

    profile.classNumber = classNumber;
    profile.nationalId = nationalId;
    profile.description = description;
    profile.studentName = studentName;
    profile.registeredAt = registeredAt;
    profile.additionalDescription = additionalDescription;
    profile.category = category;
    profile.save();

    return NextResponse.json(
      {
        message: "مورد انضباطی مورد نظر با موفقیت ویرایش شد",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "مشکلی در سرور رخ داده است" },
      { status: 500 }
    );
  }
}
