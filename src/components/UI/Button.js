import React, { memo } from "react";
import styles from "./Button.module.scss";

const Button = (props) => {
  const {
    label,
    children,
    class: className,
    style,
    ...nativeProps
  } = props;
  return (
    <button
      className={[
        className || "",
        styles.Button
      ].join(" ")}
      style={style}
      {...nativeProps}
    >
      {label || children}
    </button>
  );
};

export default memo(Button);
