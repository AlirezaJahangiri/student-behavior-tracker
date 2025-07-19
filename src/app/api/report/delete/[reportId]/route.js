import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import User from "@/models/User";
import Teacher from "@/models/Teacher";

export async function DELETE(req, context) {
  try {
    await connectDB();

    const id = context.params.reportId;

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
        {
          error: "حساب کاربری یافت نشد",
        },
        { status: 404 }
      );
    }

    const teacher = await Teacher.findOne({ _id: id });
    if (!user._id.equals(teacher.userId)) {
      return NextResponse.json(
        {
          error: "دسترسی شما به این بخش محدود شده است",
        },
        { status: 403 }
      );
    }

    await Teacher.deleteOne({ _id: id });

    return NextResponse.json(
      { message: "مورد حذف شد" },
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
