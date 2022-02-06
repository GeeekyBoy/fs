import React from "react";
import styles from "./Checkbox.module.scss";
import { ReactComponent as CheckmarkIcon } from "../../../assets/checkmark-outline.svg";

const Checkbox = (props) => {
  const { name, onChange, label, value, readOnly, style } = props;

  const onCheck = (nextVal) => {
    if (!readOnly) {
      onChange({
        target: {
          value: nextVal,
          name: name,
        },
      });
    }
  };

  return (
    <div className={styles.CheckboxShell} style={style}>
      <button
        className={[
          styles.CheckToggle,
          ...((value && [styles.checked]) || []),
        ].join(" ")}
        onClick={() => onCheck(!value)}
      >
        {value && <CheckmarkIcon width={24} height={24} />}
      </button>
      {label && (
        <label htmlFor={name} onClick={() => onCheck(!value)}>
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
