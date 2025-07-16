// CustomDatePicker.jsx
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import styles from "@/module/CustomDatePicker.module.css";

function CustomDatePicker({ value, onChange, label = "تاریخ" }) {
  return (
    <div className={styles.container}>
      <p>{label}</p>
      <DatePicker
        calendar={persian}
        locale={persian_fa}
        value={value}
        onChange={onChange}
        calendarPosition="bottom-right"
      />
    </div>
  );
}

export default CustomDatePicker;
