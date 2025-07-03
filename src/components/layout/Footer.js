import Link from "next/link";
import styles from "./Footer.module.css";
import { FaTelegramPlane } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";

function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.sec1}>
        <div className={styles.title}>
          <h3>سایت خرید و اجاره ملک</h3>
          <p>
            بهترین بستر برای خرید، فروش و اجاره ملک در سراسر ایران. با ما ملک
            موردنظرت رو راحت پیدا کن.
          </p>
        </div>
        <div className={styles.ways}>
          <ul>
            <li>تعرفه قانونی</li>
            <li>دسترسی سریع</li>
            <li>مشاورین خبره</li>
            <li>قولنامه محضری</li>
          </ul>
        </div>
      </div>
      <div className={styles.sec2}>
        <div className={styles.social}>
          <FaTelegramPlane />
          <FaInstagram />
          <FaYoutube />
          <RiTwitterXFill />
        </div>
        <div className={styles.pavaragi}>
          <p>ما را در شبکه های اجتماعی دنبال کنید!</p>
        </div>
      </div>
      <div className={styles.creator}>
        <p>
          ساخته شده با ❤️ توسط
          <span>
            <Link className={styles.creatorName} href="https://t.me/AlirezaJhg">
              {" "}
              علیرضا جهانگیری{" "}
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
}

export default Footer;
