import { p2e } from "@/utils/replaceNumber";
import styles from "@/module/TextInput.module.css";

function TextInput({
  title,
  name,
  profileData,
  setProfileData,
  textarea = false,
}) {
  const changeHandler = (e) => {
    let { name: fieldName, value } = e.target;

    // اگر فیلد classNumber بود: فقط عدد، حداکثر 3 رقم
    if (fieldName === "classNumber") {
      value = p2e(value).replace(/\D/g, ""); // فقط عدد
      if (value.length > 3) return; // حداکثر ۳ رقم
    }

    // اگر فیلد nationalId بود: فقط عدد، حداکثر ۱۲ رقم
    if (fieldName === "nationalId") {
      value = p2e(value).replace(/\D/g, ""); // فقط عدد
      if (value.length > 12) return; // حداکثر ۱۲ رقم
    }

    setProfileData({ ...profileData, [fieldName]: value });
  };

  return (
    <div className={styles.container}>
      <p>{title}</p>
      {textarea ? (
        <textarea
          name={name}
          value={profileData[name]}
          onChange={changeHandler}
        />
      ) : (
        <input
          type="text"
          name={name}
          value={profileData[name]}
          onChange={changeHandler}
          maxLength={
            name === "classNumber" ? 3 : name === "nationalId" ? 12 : undefined
          }
        />
      )}
    </div>
  );
}

export default TextInput;
