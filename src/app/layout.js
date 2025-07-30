import { yekan } from "@/utils/fonts";
import "./globals.css";
import Layout from "@/layout/Layout";
import NextAuthProvider from "@/providers/NextAuthProvider";

export const metadata = {
  title: "سامانه یکپارچه نظم دهی مدارس",
  description: "با همراهی شما، انضباط تبدیل به فرصتی برای رشد و یادگیری می‌شود، نه صرفاً محدودیت.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={yekan.className}>
        <NextAuthProvider>
          <Layout>{children}</Layout>
        </NextAuthProvider>
      </body>
    </html>
  );
}
