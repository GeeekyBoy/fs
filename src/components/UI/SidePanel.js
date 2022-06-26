import React, { memo, useState } from 'react';
import SimpleBar from 'simplebar-react';
import styles from "./SidePanel.module.scss";
import { ReactComponent as BackArrowIcon } from "../../assets/chevron-back-outline.svg";
import Button from './Button';

const SidePanel = (props) => {
  const {
    title,
    right,
    open,
    unclosable,
    actionIcon,
    onClose,
    onAction,
    header,
    footer,
    submitLabel,
    submitDisabled,
    onSubmit,
    onFilesDrop,
    onAnimationEnd,
    disabled,
    className,
    style
  } = props;
  const [inDropZone, setInDropZone] = useState(false);
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
  const handleDragEnter = (e) => {
    if (onFilesDrop) {
      e.preventDefault();
      e.stopPropagation();
      setInDropZone(true);
    }
  };
  const handleDragLeave = (e) => {
    if (onFilesDrop) {
      if (e.target.getAttribute("name") === "sidePanelShell") {
        e.preventDefault();
        e.stopPropagation();
        setInDropZone(false);
      }
    }
  };
  const handleDragOver = (e) => {
    if (onFilesDrop) {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'copy';
      setInDropZone(true);
    }
  };
  const handleDrop = (e) => {
    if (onFilesDrop) {
      e.preventDefault();
      e.stopPropagation();
      const files = e.dataTransfer ?
        [...e.dataTransfer.files] :
        [...e.target.files];
      if (files) {
        const blobs = [];
        for (const file of files) {
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onloadend = function () {
            const blob = new Blob([reader.result], { type: file.type });
            blob["name"] = file.name;
            blobs.push(blob);
            if (onFilesDrop && blobs.length === files.length) {
              onFilesDrop(blobs);
            }
          };
        }
      }
      setInDropZone(false);
    }
  };
  return (
    <div
      name="sidePanelShell"
      className={[
        styles.SidePanelShell,
        ...(right && [styles.right] || []),
        ...(open && [styles.opened] || []),
        ...(disabled && [styles.disabled] || []),
        ...(inDropZone && [styles.inDropZone] || []),
        className || ""
      ].join(" ")}
      style={style}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={styles.SidePanelToolbar}>
        {!unclosable ? (
          <button
            className={styles.SidePanelToolbarAction}
            onClick={handleClose}
          >
            <BackArrowIcon />
          </button>
        ) : (
          <div className={styles.SidePanelToolbarDumpAction} />
        )}
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
            className={styles.SidePanelSubmit}
            onClick={handleSubmit}
            disabled={submitDisabled}
          >
            {submitLabel}
          </Button>
        )}
    </div>
  );
};

export default memo(SidePanel);