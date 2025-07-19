import styles from "./Card.module.css";
import { FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";

function CardT({ data, onEdit, onDelete }) {
  const { _id, teacherName, nationalId } = data;

  return (
    <motion.div
      onClick={onEdit}
      className={styles.cardT}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.info}>
        <span className={styles.nationalId}>کدملی : {nationalId}</span>
        <h3>{teacherName}</h3>
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

export default CardT;
