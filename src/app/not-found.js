import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404 | صفحه موردنظر یافت نشد</h1>
      <Link className={styles.btn} href="/">
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}
