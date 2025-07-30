"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { signOut } from "next-auth/react";
import Loader from "@/module/Loader";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordForm() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin"); // مسیر لاگین
    }
  }, [status, router]);

  if (!session) return null; // صبر کن تا ریدایرکت انجام بشه

  if (status === "loading") return <p>در حال بررسی ورود...</p>;
  if (!session) return <p>دسترسی غیرمجاز</p>;

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/change-password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
    <form
      onSubmit={submitHandler}
      className="max-w-md mx-auto p-6 rounded-2xl shadow-md bg-white border mt-8"
    >
      <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
        تغییر رمز عبور 🔐
      </h2>

      <div className="mb-4">
        <label className="block text-right text-sm text-gray-700 mb-1">
          رمز فعلی
        </label>
        <input
          type="password"
          value={form.currentPassword}
          onChange={(e) =>
            setForm({ ...form, currentPassword: e.target.value })
          }
          required
          className="w-full p-2 border rounded-md text-right"
        />
      </div>

      <div className="mb-6">
        <label className="block text-right text-sm text-gray-700 mb-1">
          رمز جدید (حداقل 6 کاراکتر)
        </label>
        <input
          type="password"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          required
          minLength={6}
          className="w-full p-2 border rounded-md text-right"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md flex justify-center items-center"
      >
        {loading ? <Loader className="animate-spin" /> : "ثبت تغییر رمز"}
      </button>
    </form>
  );
}
