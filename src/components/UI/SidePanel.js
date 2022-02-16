import React from 'react';
import SimpleBar from 'simplebar-react';
import styles from "./SidePanel.module.scss";
import { ReactComponent as BackArrowIcon } from "../../assets/chevron-back-outline.svg";
import Button from './Button';

const SidePanel = (props) => {
  const {
    title,
    right,
    open,
    actionIcon,
    onClose,
    onAction,
    header,
    footer,
    submitLabel,
    submitDisabled,
    onSubmit,
    onAnimationEnd,
    disabled,
    class: className,
    style
  } = props;
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  }
  const handleAction = () => {
    if (actionIcon && onAction) {
      onAction();
    }
  }
  const handleAnimationEnd = (e) => {
    if (onAnimationEnd) {
      onAnimationEnd(e);
    }
  }
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  }
  return (
    <div
      className={[
        styles.SidePanelShell,
        ...(right && [styles.right] || []),
        ...(open && [styles.opened] || []),
        ...(disabled && [styles.disabled] || []),
        className || ""
      ].join(" ")}
      style={style}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={styles.SidePanelToolbar}>
        <button
          className={styles.SidePanelToolbarAction}
          onClick={handleClose}
        >
          <BackArrowIcon />
        </button>
        <span className={styles.SidePanelTitle}>
          {title || ""}
        </span>
        {actionIcon ? (
          <button
            className={styles.SidePanelToolbarAction}
            onClick={handleAction}
          >
            {React.createElement(actionIcon)}
          </button>
        ) : (
          <div className={styles.SidePanelToolbarDumpAction} />
        )}
      </div>
      {header}
      <SimpleBar className={styles.SidePanelContent}>
        {props.children}
      </SimpleBar>
      {footer}
      {submitLabel && (
        <Button
          class={styles.SidePanelSubmit}
          onClick={handleSubmit}
          disabled={submitDisabled}
        >
          {submitLabel}
        </Button>
      )}
    </div>
  );
};

export default SidePanel;