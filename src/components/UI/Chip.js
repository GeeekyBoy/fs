import React, { memo } from "react";
import Avatar from "./Avatar";
import styles from "./Chip.module.scss";
import IconButton from "./IconButton";

const Chip = (props) => {
  const {
    avatarImage,
    avatarAlt,
    avatarInitials,
    avatarIcon,
    primaryLabel,
    secondaryLabel,
    actionIcon,
    onAction,
    actionAllowed,
  } = props;
  return (
    <span
      className={[
        styles.ChipContainer,
        ...((avatarImage || avatarInitials || avatarIcon) ? [styles.withAvatar] : []),
      ].join(" ")}
    >
    {(avatarImage || avatarInitials || avatarIcon) && (
      <Avatar
        image={avatarImage}
        alt={avatarAlt}
        initials={avatarInitials}
        icon={avatarIcon}
        size={36}
        borderless
        circular
      />
    )}
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
