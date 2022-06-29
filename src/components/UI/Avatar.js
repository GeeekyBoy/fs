import React, { memo } from 'react';
import styles from "./Avatar.module.scss";

const Avatar = (props) => {
  const { 
    size,
    image,
    alt,
    initials,
    icon,
    circular
   } = props
  return image ? (
    <img
      className={styles.ImageAvatar}
      style={{
        borderRadius: circular ? "100%" : 0.315 * size,
        width: size,
        height: size
      }}
      alt={alt}
      src={image}
    />
  ) : (
    <div
      className={styles.LetterAvatar}
      style={{
        borderRadius: circular ? "100%" : 0.315 * size,
        fontSize: (size - 1) / 2.4,
        minWidth: size - 1,
        minHeight: size - 1,
        width: size - 1,
        height: size - 1
      }}
    >
      {initials || React.createElement(icon, {})}
    </div>
  )
}

export default memo(Avatar)