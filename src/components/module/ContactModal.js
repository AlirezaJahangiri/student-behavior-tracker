"use client";

import styles from "./ContactModal.module.css";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactModal({ isOpen, onClose }) {
  const modalRef = useRef();

  useEffect(() => {
    function handleOutsideClick(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className={styles.modal}
            ref={modalRef}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <h3>اطلاعات تماس : علیرضا جهانگیری</h3>
            <p>
              آیدی تلگرام:{" "}
              <a href="https://t.me/AlirezaJhg" target="_blank">
                AlirezaJhg@
              </a>
            </p>
            <p>شماره تماس: ۰۹۱۳۳۳۶۵۰۴۵</p>
            <button className={styles.close} onClick={onClose}>
              بستن
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
