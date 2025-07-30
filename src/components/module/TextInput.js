import { p2e } from "@/utils/replaceNumber";
import styles from "@/module/TextInput.module.css";

function TextInput({
  title,
  name,
  profileData,
  setProfileData,
  textarea = false,
  readOnly = false,
}) {
  const changeHandler = (e) => {
    if (readOnly) return;

    let { name: fieldName, value } = e.target;

    // فقط اعداد برای فیلدهای خاص
    if (fieldName === "classNumber") {
      value = p2e(value).replace(/\D/g, "");
      if (value.length > 3) return;
    }

    if (fieldName === "nationalId") {
      value = p2e(value).replace(/\D/g, "");
      if (value.length > 12) return;
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
          readOnly={readOnly}
          className={readOnly ? styles.readOnly : ""}
        />
      ) : (
        <input
          type="text"
          name={name}
          value={profileData[name]}
          onChange={changeHandler}
          readOnly={readOnly}
          maxLength={
            name === "classNumber" ? 3 : name === "nationalId" ? 12 : undefined
          }
          className={readOnly ? styles.readOnly : ""}
        />
      )}
    </div>
  );
}

export default TextInput;