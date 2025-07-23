// app/page.js
"use client";

import { motion } from "framer-motion";
import styles from "./HomePage.module.css";
import Link from "next/link";
import {
  FaRegClipboard,
  FaChartBar,
  FaFilePdf,
  FaLock,
  FaNetworkWired,
  FaUsers,
  FaMobileAlt,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaHeadset,
  FaUserCheck,
} from "react-icons/fa";

export default function HomePage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <motion.div
          className={styles.sec}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className={styles.banner}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          >
            <motion.img
              src="/images/banner.svg"
              alt="banner"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </motion.div>

          <motion.div
            className={styles.hero}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            <h1>سامانه یکپارچه نظم دهی مدارس</h1>
            <p>
              این سامانه نه‌ تنها ابزاری برای ثبت و گزارش‌گیری رفتارهای
              دانش‌آموزی‌ست،
              <br /> بلکه مسیری برای رسیدن به مدرسه‌ای کارآمدتر،
              <br />
              دانش‌آموزانی مسئول‌ تر و خانواده‌هایی آگاه‌تر فراهم می‌آورد.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={styles.ctaa}
            >
              <Link href="/dashboard" className={styles.btn}>
                ورود به پنل کاربری
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section className={styles.features}>
        <h2>قابلیت‌ ها</h2>
        <div className={styles.featureList}>
          {features.map((item, i) => (
            <motion.div
              key={i}
              className={styles.featureItem}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div
                className={styles.icon}
                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              >
                {item.icon}
              </motion.div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}

const features = [
  {
    icon: <FaRegClipboard />,
    title: "ثبت سریع موارد",
    desc: "به‌سرعت و بدون پیچیدگی، موارد انضباطی را ثبت کنید.",
  },
  {
    icon: <FaChartBar />,
    title: "مشاهده گزارش‌ها",
    desc: "داشبورد کامل برای پیگیری وضعیت دانش‌آموزان.",
  },
  {
    icon: <FaFilePdf />,
    title: "خروجی PDF",
    desc: "قابل ارائه در جلسات و قابل بایگانی.",
  },
  {
    icon: <FaLock />,
    title: "دسترسی امن",
    desc: "اطلاعات شما رمزنگاری و محافظت شده است.",
  },
  {
    icon: <FaNetworkWired />,
    title: "تحت وب یکپارچه",
    desc: "بدون نیاز به نصب، از هرجای ایران به سامانه دسترسی دارید.",
  },
  {
    icon: <FaUsers />,
    title: "مدیریت آسان",
    desc: "به‌راحتی لیست دانش‌آموزان را مدیریت و دسته‌بندی کنید.",
  },
  {
    icon: <FaMobileAlt />,
    title: "کاملاً ریسپانسیو",
    desc: "سامانه روی موبایل، تبلت و کامپیوتر بدون مشکل کار می‌کند.",
  },
  {
    icon: <FaUserCheck />,
    title: "احراز هویت امن برای هر مدرسه",
    desc: "هر مدرسه با حساب کاربری اختصاصی و رمزنگاری شده وارد سامانه می‌شود.",
  },
  {
    icon: <FaChalkboardTeacher />,
    title: "پنل معلمان",
    desc: "امکان ثبت موارد قابل ذکر برای معلمان مثل تشویق، غیبت، تاخیر و...",
  },
  {
    icon: <FaCheckCircle />,
    title: "تأییدشده توسط آموزش و پرورش",
    desc: "زیر نظر ناظران آموزش‌ و پرورش و مطابق با استانداردهای رسمی.",
  },
  {
    icon: <FaHeadset />,
    title: "پشتیبانی ۲۴ ساعته",
    desc: "در تمام ساعات روز همراه شما هستیم.",
  },
];
