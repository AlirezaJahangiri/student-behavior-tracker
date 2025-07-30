"use client";

import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import Card from "@/module/Card";
import styles from "@/module/DashboardCard.module.css";
import { useState } from "react";
import { p2e } from "@/utils/replaceNumber";

function DashboardCard({ data }) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filtered = Array.isArray(data)
    ? data.filter((profile) => {
        const keyword = search.toLowerCase();
        return profile.studentName.toLowerCase().includes(keyword);
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
        placeholder="جستجو  بر اساس نام و نام خانوادگی دانش آموز"
        value={search}
        onChange={(e) => setSearch(p2e(e.target.value))}
      />

      {filtered.length === 0 && (
        <p className={styles.searchNotFound}>موردی یافت نشد...</p>
      )}

      {filtered.map((profile) => (
        <Card
          key={profile._id}
          data={profile}
          onEdit={() => editHandler(profile._id)}
          onDelete={() => deleteHandler(profile._id)}
        />
      ))}

      <Toaster />
    </div>
  );
}

export default DashboardCard;


