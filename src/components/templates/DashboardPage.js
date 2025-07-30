"use client";

import { motion } from "framer-motion";
import styles from "@/templates/DashboardPage.module.css";
import { useRouter } from "next/navigation";

function DashboardPage({ createdAt }) {
  const router = useRouter();

  const changePasswordHandler = () => {
    router.replace("/change-password");
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <h3>سلام 👋</h3>
      <p>
        با همراهی شما، انضباط تبدیل به فرصتی برای رشد و یادگیری می‌شود، نه صرفاً
        محدودیت.
      </p>

      <button onClick={changePasswordHandler} className={styles.changePassword}>
        تغییر رمز عبور
      </button>
      <div className={styles.createdAt}>
        <p>تاریخ عضویت:</p>
        <span>{new Date(createdAt).toLocaleDateString("fa-IR")}</span>
      </div>
    </motion.div>
  );
}

export default DashboardPage;
