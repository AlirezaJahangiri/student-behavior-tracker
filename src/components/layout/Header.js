"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { CiLogin } from "react-icons/ci";
import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useSession } from "next-auth/react";

function Header() {
  const { data } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className={styles.header}>
      {/* آیکون منو (مخصوص موبایل) */}
      <div className={styles.mobileMenuBtn}>
        <button
          className={styles.menuBtn}
          onClick={toggleMenu}
          aria-label="باز کردن منو"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* لینک‌های منوی دسکتاپ */}
      <nav className={styles.desktopNav}>
        <ul>
          <li>
            <Link href="/">صفحه اصلی</Link>
          </li>
          <li>
            <Link href="/">درباره ما</Link>
          </li>
        </ul>
      </nav>

      {/* آیکون ورود (نمایش در تمام دستگاه‌ها) */}
      <div className={styles.signin}>
        {data ? (
          <Link
            className={styles.signinIcon}
            href="/dashboard"
            aria-label="داشبورد"
          >
            <FaUser />
            <span className={styles.lableSignin}>داشبورد</span>
          </Link>
        ) : (
          <Link className={styles.signinIcon} href="/signin" aria-label="ورود">
            <CiLogin />
            <span className={styles.lableSignin}>ورود</span>
          </Link>
        )}
      </div>

      {/* منوی کشویی موبایل */}
      <div className={`${styles.drawer} ${isOpen ? styles.open : ""}`}>
        <ul>
          <li>
            <Link href="/" onClick={() => setIsOpen(false)}>
              صفحه اصلی
            </Link>
          </li>
          <li>
            <Link href="/" onClick={() => setIsOpen(false)}>
              درباره ما
            </Link>
          </li>
        </ul>
      </div>

      {isOpen && <div className={styles.overlay} onClick={toggleMenu}></div>}
    </header>
  );
}

export default Header;
