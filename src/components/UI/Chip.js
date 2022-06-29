import React, { memo } from "react";
import Avatar from "./Avatar";
import styles from "./Chip.module.scss";
import IconButton from "./IconButton";

const Chip = (props) => {
  const {
    user,
    primaryLabel,
    secondaryLabel,
    actionIcon,
    onAction,
    actionAllowed,
  } = props;
  return (
    <span className={styles.ChipContainer}>
    {/* <Avatar user={user} size={36} circular /> */}
    <div className={styles.ChipDetails}>
      <span>{primaryLabel}</span>
      {secondaryLabel && (
        <span>{secondaryLabel}</span>
      )}
    </div>
    {actionAllowed && (
      <IconButton
        icon={actionIcon}
        onClick={onAction}
      />
    )}
  </span>
  );
};

export default memo(Chip);
