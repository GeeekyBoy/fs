import React, { memo } from "react";
import styles from "./TabView.module.scss";
import { ReactComponent as YoutubeIcon } from "../../assets/brands/youtube.svg";
import { ReactComponent as CloseIcon } from "@fluentui/svg-icons/icons/dismiss_16_regular.svg";
import IconButton from "./IconButton";

const TabView = (props) => {
  const {
    tabs = [],
    value,
    onChange,
    onCloseTab,
    disabled,
  } = props;
  const handleChange = (nextVal) => {
    if (!disabled && value !== nextVal && onChange) {
      onChange(nextVal);
    }
  }
  const handleCloseTab = (tab) => {
    if (!disabled && onCloseTab) {
      onCloseTab(tab);
    }
  }
  return (
    <div
      className={[
        styles.TabViewContainer,
        ...((disabled && [styles.disabled]) || []),
      ].join(" ")}
    >
      <div className={styles.TabViewTabs}>
        {tabs.map((x, i) => (
          <div
            className={[
              styles.TabViewTab,
              "noselect",
              ...((value === x[0] && [styles.selected]) || []),
            ].join(" ")}
            key={x[0]}
            onClick={() => handleChange(x[0])}
          >
            <YoutubeIcon width={16} height={16} />
            <span>{x[1]}</span>
            {i !== 0 && (
              <IconButton
                icon={CloseIcon}
                onClick={() => handleCloseTab(x[0])}
              />
            )}
          </div>
        ))}
      </div>
      <div className={styles.TabsContents}>
        {tabs.map((x) => (
          <div
            className={[
              styles.TabContents,
              ...((value === x[0] && [styles.selected]) || []),
            ].join(" ")}
            key={x[0]}
          >
            {x[2]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(TabView);
