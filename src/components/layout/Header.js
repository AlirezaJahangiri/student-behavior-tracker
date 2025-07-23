"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { CiLogin } from "react-icons/ci";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useSession } from "next-auth/react";

function Header() {
  const { data } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <Link href="/">سامانه یکپارچه نظم دهی مدارس</Link>
      </div>
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
    </header>
  );
}

export default Header;
