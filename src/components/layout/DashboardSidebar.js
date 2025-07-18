"use client";

import Link from "next/link";
import LogoutButton from "@/module/LogoutButton";
import styles from "@/layout/DashboardSidebar.module.css";
import { usePathname } from "next/navigation";
import { IoMdSchool } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";

import { useState, useEffect, useRef } from "react";

function DashboardSidebar({ children, email, role }) {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  const [isOpen, setIsOpen] = useState(false);
  const [isAnimatingClose, setIsAnimatingClose] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sidebarRef = useRef();

  // تشخیص اندازه صفحه
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 771);
    };

    checkScreenSize(); // بار اول
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // بستن با انیمیشن
  const closeSidebarWithAnimation = () => {
    setIsAnimatingClose(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimatingClose(false);
    }, 300);
  };

  // کلیک روی لینک فقط در موبایل باعث بستن شود
  const onLinkClick = () => {
    if (isMobile) {
      closeSidebarWithAnimation();
    }
  };

  // کلیک بیرون سایدبار
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        closeSidebarWithAnimation();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  return (
    <div className={styles.container}>
      {/* دکمه همبرگر فقط در موبایل */}
      {isMobile && (
        <button
          className={styles.hamburger}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle sidebar menu"
        >
          <GiHamburgerMenu size={35} />
        </button>
      )}

      {/* سایدبار */}
      <div
        ref={sidebarRef}
        className={`${styles.sidebar} ${
          isMobile && isOpen ? styles.open : ""
        } ${isMobile && isAnimatingClose ? styles.close : ""}`}
      >
        <IoMdSchool size={40} />
        {role === "ADMIN" ? "ادمین" : null}
        <p>{email}</p>
        <span className={styles.seperator}></span>

        <Link
          href="/dashboard"
          className={isActive("/dashboard") ? styles.active : ""}
          onClick={onLinkClick}
        >
          <span>حساب کاربری</span>
        </Link>

        <Link
          href="/dashboard/my-profiles"
          className={isActive("/dashboard/my-profiles") ? styles.active : ""}
          onClick={onLinkClick}
        >
          <span>موارد انضباطی</span>
        </Link>

        <Link
          href="/dashboard/add"
          className={isActive("/dashboard/add") ? styles.active : ""}
          onClick={onLinkClick}
        >
          <span>ثبت مورد انضباطی</span>
        </Link>

        <Link
          href="/dashboard/teachers"
          className={
            isActive("/dashboard/teachers") ? styles.active : ""
          }
          onClick={onLinkClick}
        >
          <span>پنل معلمان</span>
        </Link>

        {role === "ADMIN" && (
          <Link
            href="/admin"
            className={isActive("/admin") ? styles.active : ""}
            onClick={onLinkClick}
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
