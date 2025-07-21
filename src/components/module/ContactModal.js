"use client";

import styles from "./ContactModal.module.css";
import { useEffect, useRef } from "react";

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

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <h3>اطلاعات تماس</h3>
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
      </div>
    </div>
  );
}
