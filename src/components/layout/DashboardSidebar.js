"use client";

import Link from "next/link";
import LogoutButton from "@/module/LogoutButton";
import styles from "@/layout/DashboardSidebar.module.css";
import { usePathname } from "next/navigation";
import { IoMdSchool } from "react-icons/io";

function DashboardSidebar({ children, email, role }) {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <IoMdSchool size={40} />
        {role === "ADMIN" ? "ادمین" : null}
        <p>{email}</p>
        <span className={styles.seperator}></span>

        <Link
          href="/dashboard"
          className={isActive("/dashboard") ? styles.active : ""}
        >
          <span>حساب کاربری</span>
        </Link>

        <Link
          href="/dashboard/my-profiles"
          className={isActive("/dashboard/my-profiles") ? styles.active : ""}
        >
          <span>موارد انضباطی</span>
        </Link>

        <Link
          href="/dashboard/add"
          className={isActive("/dashboard/add") ? styles.active : ""}
        >
          <span>ثبت مورد انضباطی</span>
        </Link>

        {role === "ADMIN" && (
          <Link
            href="/admin"
            className={isActive("/admin") ? styles.active : ""}
          >
            <span>در انتظار تایید</span>
          </Link>
        )}

        <LogoutButton />
      </div>
      <div className={styles.main}>{children}</div>
    </div>
  );
}
export default DashboardSidebar;
