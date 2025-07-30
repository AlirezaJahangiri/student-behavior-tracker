"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import TextInput from "@/module/TextInput";
import TextList from "@/module/TextList";
import styles from "@/templates/AddTeacherPage.module.css";
import Loader from "@/module/Loader";
import { generatePdfT } from "@/utils/pdfGeneratorT";
import { motion } from "framer-motion";
import { decryptData } from "@/utils/encrypt";

function AddTeacherPage({ data }) {
  const [profileData, setProfileData] = useState({
    fatherName: "",
    teacherName: "",
    descriptions: [],
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
        _id: data._id, 
        teacherName: safeDecrypt(data.teacherName),
        fatherName: safeDecrypt(data.fatherName),
        descriptions: data.descriptions.map((desc) => ({
          ...desc,
          text: safeDecrypt(desc.text),
          date: desc.date,
        })),
      };
      setProfileData(decryptedData);
    }
  }, [data]);

  const submitHandler = async () => {
    setLoading(true);
    const res = await fetch("/api/report", {
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
        router.push("/dashboard/teachers");
      }, 500);
    }
  };

  const editHandler = async () => {
    setLoading(true);
    const res = await fetch("/api/report", {
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
        router.push("/dashboard/teachers");
      }, 500);
    }
  };

  const handleSaveAndDownloadPdf = async () => {
    setLoading(true);

    const loadingToastId = toast.loading("در حال ساخت PDF...");

    const response = await fetch("/api/report", {
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

    await generatePdfT(profileData);

    toast.success("PDF با موفقیت ساخته شد");

    if (!data) {
      setTimeout(() => {
        router.refresh();
        router.push("/dashboard/teachers");
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
        <h2 style={{ textAlign: "center" }}>📝 گزارش کار دبیر</h2>

        <p>
          <strong>👤 نام و نام خانوادگی دبیر:</strong>{" "}
          {profileData.teacherName || "-"}
        </p>
        <p>
          <strong>🆔 نام پدر :</strong> {profileData.fatherName || "-"}
        </p>

        <hr />

        <h3>✅ موارد ذکر شده:</h3>
        {profileData.descriptions?.length > 0 ? (
          profileData.descriptions.map((item, index) => (
            <p key={index}>
              {index + 1} - {new Date(item.date).toLocaleDateString("fa-IR")} -{" "}
              {item.text || "-"}
            </p>
          ))
        ) : (
          <p>موردی ثبت نشده است</p>
        )}

        <hr />
      </div>

      <h3 className={styles.title}>
        {data ? "ویرایش مورد دبیر" : "ثبت مورد دبیر"}
      </h3>

      <div className={styles.inputsSec1}>
        <TextInput
          title="نام و نام خانوادگی دبیر"
          name="teacherName"
          profileData={profileData}
          setProfileData={setProfileData}
          readOnly={!!data} // فقط در حالت ویرایش readonly باشه
        />

        <TextInput
          title="نام پدر"
          name="fatherName"
          profileData={profileData}
          setProfileData={setProfileData}
          readOnly={!!data}
        />
      </div>

      <h3 className={styles.alert}>موارد قابل ذکر</h3>
      <div className={styles.inputsSec3}>
        <TextList
          profileData={profileData}
          setProfileData={setProfileData}
          type="descriptions"
        />
      </div>

      <Toaster />
      <div className={styles.actions}>
        {loading ? (
          <Loader />
        ) : data ? (
          <button className={styles.submit} onClick={editHandler}>
            ویرایش
          </button>
        ) : (
          <button className={styles.submit} onClick={submitHandler}>
            ثبت
          </button>
        )}
        <button className={styles.pdf} onClick={handleSaveAndDownloadPdf}>
          ذخیره به صورت PDF
        </button>
      </div>
    </motion.div>
  );
}

export default AddTeacherPage;
