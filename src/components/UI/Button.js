import React from "react";
import styles from "./Button.module.scss";

const Button = (props) => {
  const { label, children, ...nativeProps } = props;
  return (
    <button className={styles.Button} {...nativeProps}>
      {label || children}
    </button>
  );
};

export default Button;
