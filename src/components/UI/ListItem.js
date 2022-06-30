import React, { memo } from "react"
import styles from "./ListItem.module.scss"

const ListItem = (props) => {
  const {
    id,
    primaryLabel,
    secondaryLabel,
    prefix,
    onSelect,
    listeners,
    selected,
    disabled,
  } = props
  const selectProject = () => {
    if (!selected && onSelect) {
      onSelect(id)
    }
  } 
  return (
    <div
      className="noselect"
      onClick={() => selectProject(id)}
      // {...listeners}
    >
      <div
        className={[
          styles.ListItemContainer,
          ...(selected && [styles.selected] || []),
          ...(disabled && [styles.disabled] || []),
        ].join(" ")}
      >
        {prefix}
        <div className={styles.ListItemDetails}>
          <span className={styles.ListItemPrimary}>
            {primaryLabel}
          </span>
          {secondaryLabel && (
            <span className={styles.ListItemSecondary}>
              {secondaryLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ListItem);