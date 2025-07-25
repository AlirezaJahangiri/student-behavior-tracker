/* eslint-disable */

import styles from "./Footer.module.css";
import {
  FaTelegramPlane,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h2>سامانه یکپارچه نظم‌ دهی مدارس</h2>
          <p>مدیریت هوشمند و امن برای مدارس شما</p>
        </div>

        <div className={styles.links}>
          <h3>لینک‌های مفید</h3>
          <ul>
            <li>
              <a href="/dashboard">ورود به پنل</a>
            </li>
            <li>
              <a href="/#features">قابلیت‌ ها</a>
            </li>
          </ul>
        </div>

        <div className={styles.contact}>
          <h3>تماس با ما</h3>
          <p>
            <FaMapMarkerAlt /> اصفهان، ایران
          </p>
          <p>
            <FaPhoneAlt /> ۰۹۱۳۳۳۶۵۰۴۵
          </p>
          <p>
            <FaEnvelope />
            <a href="mailto:babywebdeveloper1@gmail.com">
              babywebdeveloper1@gmail.com
            </a>
          </p>
          <p>
            <FaTelegramPlane />
            <a href="https://t.me/AlirezaJhg" target="_blank" rel="noreferrer">
              تلگرام
            </a>
          </p>
        </div>
      </div>

      <div className={styles.copy}>
        <p>
          این سامانه با رعایت استانداردهای رسمی و زیر نظر اداره آموزش و پرورش
          طراحی شده است.
        </p>

        <p>© تمام حقوق برای سامانه یکپارچه نظم‌ دهی مدارس محفوظ است. ۱۴۰۴</p>

        <p>
          طراحی و توسعه توسط{" "}
          <a href="https://t.me/AlirezaJhg" target="_blank" rel="noreferrer">
            علیرضا جهانگیری
          </a>
        </p>
      </div>
    </footer>
  );
}
