"use client";

import { motion, AnimatePresence } from "framer-motion";
import DashboardCard from "@/module/DashboardCard";
import styles from "@/templates/MyProfilesPage.module.css";

function MyProfilesPage({ profiles }) {
  const hasProfiles = profiles.length > 0;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={hasProfiles ? "with-data" : "empty"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {hasProfiles ? (
          <DashboardCard data={profiles} />
        ) : (
          <p className={styles.text}>هیچ مورد انضباطی ثبت نشده است</p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default MyProfilesPage;
