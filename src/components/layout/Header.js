"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { CiLogin } from "react-icons/ci";
import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

function Header() {
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
            <Link href="/buy-residential">آگهی‌ها</Link>
          </li>
        </ul>
      </nav>

      {/* آیکون ورود (نمایش در تمام دستگاه‌ها) */}
      <div className={styles.signin}>
        <Link className={styles.signinIcon} href="/signin" aria-label="ورود">
          <CiLogin />
          <span className={styles.lableSignin}>ورود</span>
        </Link>
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
            <Link href="/buy-residential" onClick={() => setIsOpen(false)}>
              آگهی‌ها
            </Link>
          </li>
        </ul>
      </div>

      {isOpen && <div className={styles.overlay} onClick={toggleMenu}></div>}
    </header>
  );
}

export default Header;
