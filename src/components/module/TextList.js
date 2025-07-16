import { MdOutlineLibraryAdd } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import styles from "@/module/TextList.module.css";
import CustomDatePicker from "./CustomDatePicker";

function TextList({ profileData, setProfileData, type, title }) {
  const handleTextChange = (e, index) => {
    const updatedList = [...profileData[type]];
    updatedList[index].text = e.target.value;
    setProfileData({ ...profileData, [type]: updatedList });
  };

  const handleDateChange = (date, index) => {
    const updatedList = [...profileData[type]];
    updatedList[index].date = date;
    setProfileData({ ...profileData, [type]: updatedList });
  };

  const handleAdd = () => {
    setProfileData({
      ...profileData,
      [type]: [...profileData[type], { text: "", date: new Date() }],
    });
  };

  const handleDelete = (index) => {
    const updatedList = [...profileData[type]];
    updatedList.splice(index, 1);
    setProfileData({ ...profileData, [type]: updatedList });
  };

  return (
    <div className={styles.container}>
      <p>{title}</p>

      {profileData[type].map((item, index) => (
        <div key={index}>
          <div className={styles.card}>
            <CustomDatePicker
              value={item.date}
              onChange={(date) => handleDateChange(date, index)}
              label="تاریخ"
            />

            <textarea
              value={item.text}
              onChange={(e) => handleTextChange(e, index)}
              placeholder="توضیحات"
              rows={4}
              className={styles.textarea}
            />
          </div>

          <button
            onClick={() => handleDelete(index)}
            className={styles.deleteBtn}
          >
            حذف
            <AiOutlineDelete />
          </button>

          {index !== profileData[type].length - 1 && (
            <div className={styles.divider} />
          )}
        </div>
      ))}

      <button onClick={handleAdd} className={styles.addBtn}>
        افزودن
        <MdOutlineLibraryAdd />
      </button>
    </div>
  );
}

export default TextList;
