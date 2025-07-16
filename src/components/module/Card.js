import Link from "next/link";
import moment from "jalali-moment";
import styles from "./Card.module.css";
import { motion } from "framer-motion";

function Card({
  data: { _id, category, studentName, registeredAt, classNumber, nationalId },
  onEdit,
  onDelete,
}) {
  return (
    <motion.div
      className={styles.container}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.sec1}>
        <div>
          🆔 <span>{nationalId}</span>
        </div>
        <div>
          👨🏻‍🎓 <span className={styles.studentName}>{studentName}</span>
        </div>
        <div className={styles.actions}>
          <button onClick={onEdit}>
            <img className={styles.img} src="/images/edit.png" alt="edit" />
          </button>
          <button onClick={onDelete}>
            <img className={styles.img} src="/images/delete.svg" alt="delete" />
          </button>
        </div>
      </div>
      <div className={styles.sec2}>
        <div>
          #️⃣ <span className={styles.classNumber}>{classNumber}</span>
        </div>
        <div>
          {category === "تنبیهی" ? (
            <span className={styles.punishment}>تنبیهی</span>
          ) : (
            <span className={styles.positive}>تشویقی</span>
          )}
        </div>
        <div>
          🕣{" "}
          <span>{moment(registeredAt).locale("fa").format("YYYY/MM/DD")}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default Card;
