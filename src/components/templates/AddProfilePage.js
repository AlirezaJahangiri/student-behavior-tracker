"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import TextInput from "@/module/TextInput";
import TextList from "@/module/TextList";
import CustomDatePicker from "@/module/CustomDatePicker";
import styles from "@/templates/AddProfilePage.module.css";
import Loader from "@/module/Loader";
import { generatePdf } from "@/utils/pdfGenerator";
import { motion } from "framer-motion";

function AddProfilePage({ data }) {
  const [profileData, setProfileData] = useState({
    classNumber: "",
    nationalId: "",
    studentName: "",
    encouragements: [],
    punishments: [],
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (data) setProfileData(data);
  }, [data]);

  const submitHandler = async () => {
    setLoading(true);
    const res = await fetch("/api/profile", {
      method: "POST",
      body: JSON.stringify(profileData),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success(data.message);
      router.refresh();
      setTimeout(() => {
        router.push("/dashboard/my-profiles");
      }, 1000);
    }
  };

  const editHandler = async () => {
    setLoading(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      body: JSON.stringify(profileData),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success(data.message);
      router.refresh();
      setTimeout(() => {
        router.push("/dashboard/my-profiles");
      }, 1000);
    }
  };

  const handleSaveAndDownloadPdf = async () => {
    setLoading(true);
    const response = await fetch("/api/profile", {
      method: data ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });

    const result = await response.json();
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message);
    generatePdf(profileData);

    if (!data) {
      setTimeout(() => {
        router.refresh();
        router.push("/dashboard/my-profiles");
      }, 1000);
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div
        id="pdf-content"
        dir="rtl"
        style={{
          fontSize: "25px",
          fontFamily: "Vazir",
          padding: "30px",
          width: "800px",
          color: "#000",
          backgroundColor: "#fff",
          position: "absolute",
          top: "-9999px",
          right: "-9999px",
          lineHeight: "2",
        }}
      >
        <h2 style={{ textAlign: "center" }}>📝 گزارش انضباطی دانش‌آموز</h2>

        <p>
          <strong>👤 نام دانش‌آموز:</strong> {profileData.studentName || "-"}
        </p>
        <p>
          <strong>🆔 کد دانش‌آموزی:</strong> {profileData.nationalId || "-"}
        </p>
        <p>
          <strong>🏫 کلاس:</strong> {profileData.classNumber || "-"}
        </p>

        <hr />

        <h3>🎉 تشویقی:</h3>
        {profileData.encouragements?.length > 0 ? (
          profileData.encouragements.map((item, index) => (
            <p key={index}>
              {index + 1}️⃣ - {new Date(item.date).toLocaleDateString("fa-IR")}{" "}
              - {item.text || "-"}
            </p>
          ))
        ) : (
          <p>موردی ثبت نشده است</p>
        )}

        <hr />

        <h3>⚠️ تنبیهی:</h3>
        {profileData.punishments?.length > 0 ? (
          profileData.punishments.map((item, index) => (
            <p key={index}>
              {index + 1}️⃣ - {new Date(item.date).toLocaleDateString("fa-IR")}{" "}
              - {item.text || "-"}
            </p>
          ))
        ) : (
          <p>موردی ثبت نشده است</p>
        )}
      </div>

      <h3 className={styles.title}>
        {data ? "ویرایش مورد انضباطی" : "ثبت مورد انضباطی"}
      </h3>

      <div className={styles.inputsSec1}>
        <TextInput
          title="شماره دانش‌آموزی"
          name="nationalId"
          profileData={profileData}
          setProfileData={setProfileData}
        />
        <TextInput
          title="نام دانش‌آموز"
          name="studentName"
          profileData={profileData}
          setProfileData={setProfileData}
        />
        <TextInput
          title="شماره کلاس"
          name="classNumber"
          profileData={profileData}
          setProfileData={setProfileData}
        />
      </div>

      <h3 className={styles.positive}>موارد تشویقی</h3>
      <div className={styles.inputsSec3}>
        <TextList
          profileData={profileData}
          setProfileData={setProfileData}
          type="encouragements"
        />
      </div>

      <h3 className={styles.punishment}>موارد تنبیهی</h3>
      <div className={styles.inputsSec3}>
        <TextList
          profileData={profileData}
          setProfileData={setProfileData}
          type="punishments"
        />
      </div>

      <Toaster />
      <div className={styles.actions}>
        {loading ? (
          <Loader />
        ) : data ? (
          <button className={styles.submit} onClick={editHandler}>
            ویرایش مورد انضباطی
          </button>
        ) : (
          <button className={styles.submit} onClick={submitHandler}>
            ثبت مورد انضباطی
          </button>
        )}
        <button className={styles.pdf} onClick={handleSaveAndDownloadPdf}>
          ذخیره به صورت PDF
        </button>
      </div>
    </motion.div>
  );
}

export default AddProfilePage;
