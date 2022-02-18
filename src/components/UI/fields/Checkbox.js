import React, { memo } from "react";
import styles from "./Checkbox.module.scss";
import { ReactComponent as CheckmarkIcon } from "../../../assets/checkmark-outline.svg";

const Checkbox = (props) => {
  const {
    name,
    onChange,
    label,
    value = false,
    readOnly,
    disabled,
    class: className,
    style
  } = props;

  const handleCheck = (nextVal) => {
    if (!(readOnly || disabled)) {
      onChange({
        target: {
          value: nextVal,
          name: name,
        },
      });
    }
  };

  return (
    <div
      className={[
        styles.CheckboxShell,
        ...(disabled && [styles.disabled] || []),
        ...(readOnly && [styles.readOnly] || []),
        className || ""
      ].join(" ")}
      style={style}
    >
      <button
        className={[
          styles.CheckToggle,
          ...((value && [styles.checked]) || []),
        ].join(" ")}
        onClick={() => handleCheck(!value)}
      >
        {value && <CheckmarkIcon width={24} height={24} />}
      </button>
      {label && (
        <label htmlFor={name} onClick={() => handleCheck(!value)}>
          {label}
        </label>
      )}
    </div>
  );
};

export default memo(Checkbox);
