"use client";

import { motion, AnimatePresence } from "framer-motion";
import DashboardCardT from "@/module/DashboardCardT";
import styles from "@/templates/MyProfilesPage.module.css";
import Link from "next/link";

function MyTeacherProfilesPage({ teachers }) {
  const hasTeachers = teachers.length > 0;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={hasTeachers ? "with-data" : "empty"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
       <Link href="/dashboard/teachers/add"><button className={styles.btnTeacher}>ثبت مورد جدید</button></Link>
        {hasTeachers ? (
          <DashboardCardT data={teachers} />
        ) : (
          <p className={styles.text}>هیچ موردی برای دبیر ها ثبت نشده است</p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default MyTeacherProfilesPage;
