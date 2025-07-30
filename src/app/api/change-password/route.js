import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import { verifyPassword, hashPassword } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "ابتدا وارد حساب شوید" },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "رمز جدید باید حداقل ۶ کاراکتر باشد" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    const isValid = await verifyPassword(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "رمز فعلی اشتباه است" },
        { status: 403 }
      );
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return NextResponse.json({ message: "رمز عبور با موفقیت تغییر کرد" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
