"use client";

import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import CardT from "./CardT";
import styles from "@/module/DashboardCard.module.css";
import { useState } from "react";
import { p2e } from "@/utils/replaceNumber";

function DashboardCardT({ data }) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filtered = Array.isArray(data)
    ? data.filter((teacher) => {
        const keyword = search.toLowerCase();
        return teacher.teacherName.toLowerCase().includes(keyword);
      })
    : [];

  const deleteHandler = async (id) => {
    const res = await fetch(`/api/report/delete/${id}`, {
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
    router.push(`/dashboard/teachers/${id}`);
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="جستجو بر اساس نام دبیر"
        value={search}
        onChange={(e) => setSearch(p2e(e.target.value))}
      />

      {filtered.length === 0 && (
        <p className={styles.searchNotFound}>موردی یافت نشد...</p>
      )}

      {filtered.map((teacher) => (
        <CardT
          key={teacher._id}
          data={teacher}
          onEdit={() => editHandler(teacher._id)}
          onDelete={() => deleteHandler(teacher._id)}
        />
      ))}

      <Toaster />
    </div>
  );
}

export default DashboardCardT;
