import React, { memo } from "react";
import styles from "./Button.module.scss";

const Button = (props) => {
  const {
    label,
    secondary,
    fullWidth,
    children,
    className,
    style,
    ...nativeProps
  } = props;
  return props.type === "submit" ? (
    <input
      value={label}
      className={[
        className || "",
        styles.Button,
        ...(secondary && [styles.secondary] || []),
        ...(fullWidth && [styles.fullWidth] || []),
      ].join(" ")}
      style={style}
      {...nativeProps}
    />
  ) : (
    <button
      className={[
        className || "",
        styles.Button,
        ...(secondary && [styles.secondary] || []),
        ...(fullWidth && [styles.fullWidth] || []),
      ].join(" ")}
      style={style}
      {...nativeProps}
    >
      {label || children}
    </button>
  );
};

export default memo(Button);
