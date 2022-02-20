import React, { memo, useState } from 'react';
import styles from "./Notification.module.scss"
import { ReactComponent as CloseIcon } from "../../assets/close-outline.svg"
import { ReactComponent as ChevronUpIcon } from "../../assets/chevron-up-outline.svg"
import { ReactComponent as ChevronDownIcon } from "../../assets/chevron-down-outline.svg"
import Avatar from './Avatar';

const Notification = (props) => {
  const {
    onOpen,
    onDismiss,
    onAnimationEnd,
    notificationData,
    senderData,
    class: className,
    style
  } = props
  const openLink = (link) => {
    if (link && onOpen) {
      onOpen("/" + onOpen);
    }
  }
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div
      className={[
        styles.NotificationShell,
        className || ""
      ].join(" ")}
      style={style}
      onAnimationEnd={onAnimationEnd}
    >
      <div
        className={[
          styles.NotificationContainer,
          "noselect",
          ...(notificationData?.payload.link && [styles.clickable] || []),
          ...(isExpanded && [styles.expanded] || [])
        ].join(" ")}
        onClick={() => openLink(notificationData?.payload.link)}
      >
        <div className={styles.NotificationControls}>
          <div onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}>
            <span>
              {new Date(notificationData.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
            </span>
            {isExpanded ? (
              <ChevronUpIcon
                width={12}
                height={12}
              />
            ) : (
              <ChevronDownIcon
                width={12}
                height={12}
              />
            )}
          </div>
          <button
            className={styles.NotificationCloseBtn}
            onClick={onDismiss}
          >
            <CloseIcon
              height={16}
              width={16}
            />
          </button>
        </div>
        <div className={styles.NotificationContent}>
          <Avatar user={senderData} size={32} />
          <div>
            <div className={styles.NotificationTopPart}>
              <span>
                {senderData.firstName} {senderData.lastName}
              </span>
            </div>
            <div className={styles.NotificationBottomPart}>
              {notificationData.type === "ASSIGNMENT" && (
                <span>
                  Assigned a task to&nbsp;
                  {notificationData.payload.assignee ? 
                  (<b>@{notificationData.payload.assignee}</b>) : "you"}.
                  Tap here to review it.
                </span>
              )}
              {notificationData.type === "DUE_CHANGE" && (
                parseInt(notificationData.payload.old_due, 10) ? (
                  <span>
                    Changed due date of a task from&nbsp;
                    <b>{new Date(parseInt(notificationData.payload.old_due, 10)).toLocaleDateString()}</b> to&nbsp;
                    <b>{new Date(parseInt(notificationData.payload.new_due, 10)).toLocaleDateString()}</b>.
                    Tap here to review it.
                  </span>
                ) : (
                  <span>
                    Set due date of a task to&nbsp;
                    <b>{new Date(parseInt(notificationData.payload.new_due, 10)).toLocaleDateString()}</b>.
                    Tap here to review it.
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Notification);
