"use client";

import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import Card from "@/module/Card";
import styles from "@/module/DashboardCard.module.css";
import { useState } from "react";

function DashboardCard({ data }) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filtered = Array.isArray(data)
    ? data.filter((profile) => {
        const keyword = search.toLowerCase();
        return (
          profile.studentName.toLowerCase().includes(keyword) ||
          profile.nationalId.toLowerCase().includes(keyword)
        );
      })
    : [];

  const deleteHandler = async (id) => {
    const res = await fetch(`/api/profile/delete/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message);
      router.refresh();
    }
  };

  const editHandler = (id) => {
    router.push(`/dashboard/my-profiles/${id}`);
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="جستجو بر اساس نام یا کد ملی"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", marginBottom: "20px", width: "100%" }}
      />

      {filtered.length === 0 && <p>موردی یافت نشد.</p>}

      {filtered.map((profile) => (
        <div key={profile._id}>
          <Card data={profile} />
          <div className={styles.main}>
            <button onClick={() => editHandler(profile._id)}>
              ویرایش
              <FiEdit />
            </button>
            <button onClick={() => deleteHandler(profile._id)}>
              حذف
              <AiOutlineDelete />
            </button>
          </div>
        </div>
      ))}

      <Toaster />
    </div>
  );
}

export default DashboardCard;
