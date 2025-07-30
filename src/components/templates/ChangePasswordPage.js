"use client";
import styles from "./ChangePasswordPage.module.css";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Loader from "@/module/Loader";

function ChangePasswordPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin");
    }
  }, [status, router]);

  if (!session) return null;

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.newPassword !== form.confirmPassword) {
      toast.error("رمز جدید و تأیید آن مطابقت ندارند");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/change-password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success("رمز با موفقیت تغییر کرد. در حال خروج...");
      setTimeout(() => {
        signOut({ callbackUrl: "/signin" });
      }, 1500);
    }
  };

  return (
    <motion.div
      className={styles.form}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.h4
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        تغییر رمز عبور
      </motion.h4>

      <motion.form
        onSubmit={submitHandler}
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.input
          type="password"
          placeholder="رمز عبور فعلی"
          value={form.currentPassword}
          onChange={(e) =>
            setForm({ ...form, currentPassword: e.target.value })
          }
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 },
          }}
        />

        <motion.div
          style={{ position: "relative" }}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="رمز عبور جدید"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className={styles.eyeIcon}
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </motion.div>

        <motion.div
          style={{ position: "relative" }}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="تأیید رمز عبور جدید"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className={styles.eyeIcon}
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </motion.div>

        {loading ? (
          <Loader />
        ) : (
          <motion.button
            type="submit"
            className={styles.submit}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            تغییر رمز عبور
          </motion.button>
        )}
      </motion.form>

      <Toaster />
    </motion.div>
  );
}

export default ChangePasswordPage;
