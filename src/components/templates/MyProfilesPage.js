import DashboardCard from "@/module/DashboardCard";
import styles from "@/templates/MyProfilesPage.module.css";

function MyProfilesPage({ profiles }) {
  return (
    <div>
      {profiles.length === 0 ? (
        <p className={styles.text}>هیچ مورد انضباطی ثبت نشده است</p>
      ) : (
        <DashboardCard data={profiles} />
      )}
    </div>
  );
}

export default MyProfilesPage;
