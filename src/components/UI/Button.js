import React, { memo } from "react";
import styles from "./Button.module.scss";

const Button = (props) => {
  const {
    label,
    icon,
    sm,
    secondary,
    fullWidth,
    children,
    ...nativeProps
  } = props;
  return props.type === "submit" ? (
    <input
      value={label}
      className={[
        styles.Button,
        ...(secondary && [styles.secondary] || []),
        ...(fullWidth && [styles.fullWidth] || []),
      ].join(" ")}
      {...nativeProps}
    />
  ) : (
    <button
      className={[
        styles.Button,
        ...(secondary && [styles.secondary] || []),
        ...(fullWidth && [styles.fullWidth] || []),
        ...(sm && [styles.sm] || []),
      ].join(" ")}
      {...nativeProps}
    >
      {icon ? React.createElement(icon, {
        className: styles.ButtonIcon,
      }) : null}
      {label || children}
    </button>
  );
};

export default memo(Button);
