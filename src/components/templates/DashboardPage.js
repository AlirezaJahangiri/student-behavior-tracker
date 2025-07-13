import styles from "@/templates/DashboardPage.module.css";

function DashboardPage({ createdAt }) {
  return (
    <div className={styles.container}>
      <h3>سلام 👋</h3>
      <p>
        با همراهی شما، انضباط تبدیل به فرصتی برای رشد و یادگیری می‌شود، نه صرفاً
        محدودیت
      </p>
      <div className={styles.createdAt}>
        <p>تاریخ عضویت:</p>
        <span>{new Date(createdAt).toLocaleDateString("fa-IR")}</span>
      </div>
    </div>
  );
}

export default DashboardPage;
