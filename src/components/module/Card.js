import styles from "./Card.module.css";
import { FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";

function Card({ data, onEdit, onDelete }) {
  const { _id, studentName, classNumber, fatherName } = data;

  return (
    <motion.div
      onClick={onEdit}
      className={styles.card}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.info}>
        <h3>{studentName}</h3>
        <span className={styles.fatherName}>
       نام پدر :  {fatherName}
        </span>
        <span>شماره کلاس : {classNumber}</span>
        <button
          className={styles.delete}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <FiTrash2 />
        </button>
      </div>
    </motion.div>
  );
}

export default Card;

