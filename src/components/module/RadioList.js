import styles from "@/module/RadioList.module.css";

function RadioList({ profileData, setProfileData }) {
  const { category } = profileData;

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  return (
    <div className={styles.container}>
      <p>مورد انضباطی</p>
      <div className={styles.main}>
        <div>
          <label htmlFor="تشویقی">تشویقی</label>
          <input
            type="radio"
            name="category"
            value="تشویقی"
            id="تشویقی"
            checked={category === "تشویقی"}
            onChange={changeHandler}
          />
        </div>
        <div>
          <label htmlFor="تنبیهی">تنبیهی</label>
          <input
            type="radio"
            name="category"
            value="تنبیهی"
            id="تنبیهی"
            checked={category === "تنبیهی"}
            onChange={changeHandler}
          />
        </div>
      </div>
    </div>
  );
}

export default RadioList;
