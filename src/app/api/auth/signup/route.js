import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import { hashPassword } from "@/utils/auth";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (token !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
    }

    await connectDB();

    const { email, password, schoolName } = await req.json();

    if (!email || !password || !schoolName) {
      return NextResponse.json(
        { error: "لطفا اطلاعات معتبر وارد کنید" },
        { status: 422 }
      );
    }

    const existingUser = await User.findOne({ email });
    console.log(existingUser);

    if (existingUser) {
      return NextResponse.json(
        { error: "این حساب کاربری وجود دارد" },
        { status: 422 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      email: email,
      password: hashedPassword,
      schoolName,
    });

    return NextResponse.json(
      { message: "حساب کاربری ایجاد شد" },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "مشکلی در سرور رخ داده است" },
      {
        status: 500,
      }
    );
  }
}
