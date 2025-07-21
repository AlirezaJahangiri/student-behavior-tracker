import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/route";
import connectDB from "@/utils/connectDB";
import User from "@/models/User";
import DashboardSidebar from "@/layout/DashboardSidebar";
import LogoutButton from "@/module/LogoutButton";

export const metadata = {
  title: "سامانه ثبت موارد انضباطی",
};

async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  await connectDB();
  const user = await User.findOne({ email: session.user.email });

  if (!user)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          textAlign: "center",
          fontWeight: "400",
          gap: "1rem",
          fontSize: "1.2rem",
        }}
      >
        <p style={{ fontWeight: "600" }}>
          {" "}
          مشکلی پیش آمده است با ادمین تماس حاصل فرمایید...{" "}
        </p>
        <LogoutButton />
      </div>
    );

  return (
    <DashboardSidebar role={user.role} schoolName={user.schoolName}>
      {children}
    </DashboardSidebar>
  );
}

export default DashboardLayout;
