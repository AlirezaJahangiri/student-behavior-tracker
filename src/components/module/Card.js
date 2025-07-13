import Link from "next/link";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiLeftArrowAlt } from "react-icons/bi";
import { icons } from "../../constants/icons";
import styles from "@/module/Card.module.css";
import { PiStudent } from "react-icons/pi";

function Card({
  data: { _id, category, studentName, registeredAt, classNumber },
}) {
  return (
    // <div className={styles.container}>
    //   <div className={styles.icon}>{icons[category]}</div>
    //   <p className={styles.title}>{studentName}</p>
    //   <p className={styles.location}>
    //     <HiOutlineLocationMarker />
    //     {description}
    //   </p>
    //   <span>{classNumber} تومان</span>
    //   <Link href={`/buy-residential/${_id}`}>
    //     مشاهده آگهی
    //     <BiLeftArrowAlt />
    //   </Link>
    // </div>

    <div className={styles.container}>
      <PiStudent />
      <span className={styles.classNumber}>{classNumber}</span>
      <span className={styles.studentName}>{studentName}</span>
      <div className={styles.category}>
        {category == "تنبیهی" ? (
          <span className={styles.punishment}>{category}</span>
        ) : (
          <span className={styles.positive}>{category}</span>
        )}
      </div>
      <span className={styles.date}>{registeredAt}</span>
    </div>
  );
}

export default Card;
