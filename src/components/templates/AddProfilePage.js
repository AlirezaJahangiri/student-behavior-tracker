"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import TextInput from "@/module/TextInput";
import TextList from "@/module/TextList";
import styles from "@/templates/AddProfilePage.module.css";
import Loader from "@/module/Loader";
import { generatePdf } from "@/utils/pdfGenerator";
import { motion } from "framer-motion";
import { decryptData } from "@/utils/encrypt";

function AddProfilePage({ data }) {
  const [profileData, setProfileData] = useState({
    fatherName: "",
    studentName: "",
    classNumber: "",
    encouragements: [],
    punishments: [],
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  function safeDecrypt(value) {
    try {
      if (typeof value === "string" && value.startsWith("U2FsdGVkX1")) {
        return decryptData(value);
      }
      return value;
    } catch (err) {
      console.error("Decryption error in client:", err);
      return value;
    }
  }
  useEffect(() => {
    if (data) {
      const decryptedData = {
        _id: data._id, // ✅ این خط برای ارسال درست به سروره
        studentName: safeDecrypt(data.studentName),
        fatherName: safeDecrypt(data.fatherName),
        classNumber: safeDecrypt(data.classNumber),
        punishments: data.punishments.map((punishment) => ({
          ...punishment,
          text: safeDecrypt(punishment.text),
          date: punishment.date,
        })),
        encouragements: data.encouragements.map((encouragement) => ({
          ...encouragement,
          text: safeDecrypt(encouragement.text),
          date: encouragement.date,
        })),
      };
      setProfileData(decryptedData);
    }
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
      }, 500);
    }
  };

  const editHandler = async () => {
    setLoading(true);
    console.log("sending profileData:", profileData);
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
      }, 500);
    }
  };

  const handleSaveAndDownloadPdf = async () => {
    setLoading(true);

    const loadingToastId = toast.loading("در حال ساخت PDF...");

    const response = await fetch("/api/profile", {
      method: data ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });

    const result = await response.json();
    setLoading(false);

    toast.dismiss(loadingToastId);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    await generatePdf(profileData);

    toast.success("PDF با موفقیت ساخته شد");

    if (!data) {
      setTimeout(() => {
        router.refresh();
        router.push("/dashboard/my-profiles");
      }, 500);
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
          <strong>👤 نام و نام خانوادگی دانش‌آموز:</strong>{" "}
          {profileData.studentName || "-"}
        </p>
        <p>
          <strong>🆔 نام پدر:</strong> {profileData.fatherName || "-"}
        </p>
        <p>
          <strong>🏫 شماره کلاس:</strong> {profileData.classNumber || "-"}
        </p>

        <hr />

        <h3>🎉 تشویقی:</h3>
        {profileData.encouragements?.length > 0 ? (
          profileData.encouragements.map((item, index) => (
            <p key={index}>
              {index + 1} - {new Date(item.date).toLocaleDateString("fa-IR")} -{" "}
              {item.text || "-"}
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
              {index + 1} - {new Date(item.date).toLocaleDateString("fa-IR")} -{" "}
              {item.text || "-"}
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
          title="نام و نام خانوادگی دانش آموز"
          name="studentName"
          profileData={profileData}
          setProfileData={setProfileData}
          readOnly={!!data} 
        />

        <TextInput
          title="نام پدر"
          name="fatherName"
          profileData={profileData}
          setProfileData={setProfileData}
          readOnly={!!data}
        />

        <TextInput
          title="شماره کلاس"
          name="classNumber"
          profileData={profileData}
          setProfileData={setProfileData}
          readOnly={!!data}
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
