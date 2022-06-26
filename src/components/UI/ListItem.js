import React, { memo } from "react"
import styles from "./ListItem.module.scss"

const ListItem = (props) => {
  const {
    id,
    primary,
    secondary,
    selected,
    onSelect,
    listeners,
    className,
    style,
  } = props
  const selectProject = () => {
    if (!selected && onSelect) {
      onSelect(id)
    }
  } 
  return (
    <div
      className={[
        "noselect",
        className || "",
      ].join(" ")}
      onClick={() => selectProject(id)}
      style={style}
      // {...listeners}
    >
      <div
        className={[
          styles.ListItemContainer,
          ...(selected && [styles.selected] || []),
        ].join(" ")}
      >
        <span className={styles.ListItemPrimary}>
          {primary}
        </span>
        {secondary && (
          <span className={styles.ListItemSecondary}>
            {secondary}
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(ListItem);