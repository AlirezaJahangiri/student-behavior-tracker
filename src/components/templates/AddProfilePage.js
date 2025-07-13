"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import TextInput from "@/module/TextInput";
import RadioList from "@/module/RadioList";
import TextList from "@/module/TextList";
import CustomDatePicker from "@/module/CustomDatePicker";
import { BounceLoader } from "react-spinners";
import styles from "@/templates/AddProfilePage.module.css";

function AddProfilePage({ data }) {
  const [profileData, setProfileData] = useState({
    classNumber: "",
    nationalId: "",
    description: "",
    studentName: "",
    registeredAt: new Date(),
    additionalDescription: [],
    category: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) setProfileData(data);
  }, []);

  const router = useRouter();

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
    }
  };

  return (
    <div className={styles.container}>
      <h3>{data ? "ویرایش مورد انضباطی" : "ثبت مورد انضباطی"}</h3>
      <div className={styles.inputs}>
        <TextInput
          title="کد ملی یا شماره دانش آموزی"
          name="nationalId"
          profileData={profileData}
          setProfileData={setProfileData}
        />
        <TextInput
          title="شماره کلاس"
          name="classNumber"
          profileData={profileData}
          setProfileData={setProfileData}
        />
        <TextInput
          title="نام دانش آموز"
          name="studentName"
          profileData={profileData}
          setProfileData={setProfileData}
        />
        <TextInput
          title="توضیحات"
          name="description"
          profileData={profileData}
          setProfileData={setProfileData}
          textarea={true}
        />

        <RadioList profileData={profileData} setProfileData={setProfileData} />

        <TextList
          title="توضیحات اضافه"
          profileData={profileData}
          setProfileData={setProfileData}
          type="additionalDescription"
        />
        <CustomDatePicker
          profileData={profileData}
          setProfileData={setProfileData}
        />
      </div>
      <Toaster />
      {loading ? (
        <BounceLoader />
      ) : data ? (
        <button className={styles.submit} onClick={editHandler}>
          ویرایش مورد انضباطی
        </button>
      ) : (
        <button className={styles.submit} onClick={submitHandler}>
          ثبت مورد انضباطی
        </button>
      )}
    </div>
  );
}

export default AddProfilePage;
