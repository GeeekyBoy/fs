import React, { memo, useState } from 'react';
import styles from "./Notification.module.scss"
import { ReactComponent as CloseIcon } from "../../assets/close-outline.svg"
import { ReactComponent as ChevronUpIcon } from "../../assets/chevron-up-outline.svg"
import { ReactComponent as ChevronDownIcon } from "../../assets/chevron-down-outline.svg"
import Avatar from './Avatar';
import { convertFromRaw } from 'draft-js';
import formatDate from '../../utils/formatDate';

const Notification = (props) => {
  const {
    onOpen,
    onDismiss,
    onAnimationEnd,
    notificationData,
    senderData,
    className,
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
          ...(notificationData?.link && [styles.clickable] || []),
          ...(isExpanded && [styles.expanded] || [])
        ].join(" ")}
        onClick={() => openLink(notificationData?.link)}
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
              {notificationData.field === "assignees" &&
                notificationData.action === "append" && (
                <span>
                  Assigned the task&nbsp;
                  &quot;<b>{notificationData.hint}</b>&quot; to&nbsp;
                  {notificationData.value ? 
                  (<b>@{notificationData.value}</b>) : "you"}.
                </span>
              )}
              {notificationData.field === "assignees" &&
                notificationData.action === "remove" && (
                <span>
                  Removed {notificationData.value ?
                  (<b>@{notificationData.value}</b>) : "you"}&nbsp;
                  from the task &quot;<b>{notificationData.hint}</b>&quot;.
                </span>
              )}
              {notificationData.field === "anonymousAssignees" &&
                notificationData.action === "append" && (
                <span>
                  Assigned the task&nbsp;
                  &quot;<b>{notificationData.hint}</b>&quot; to&nbsp;
                  &quot;<b>{notificationData.value}</b>&quot;.
                </span>
              )}
              {notificationData.field === "anonymousAssignees" &&
                notificationData.action === "remove" && (
                <span>
                  Removed &quot;<b>{notificationData.value}</b>&quot;&nbsp;
                  from the task &quot;<b>{notificationData.hint}</b>&quot;.
                </span>
              )}
              {notificationData.field === "invitedAssignees" &&
                notificationData.action === "append" && (
                <span>
                  Invited &quot;<b>{notificationData.value}</b>&quot;&nbsp;
                  to the task &quot;<b>{notificationData.hint}</b>&quot;.
                </span>
              )}
              {notificationData.field === "invitedAssignees" &&
                notificationData.action === "remove" && (
                <span>
                  Disinvited &quot;<b>{notificationData.value}</b>&quot;&nbsp;
                  to the task &quot;<b>{notificationData.hint}</b>&quot;.
                </span>
              )}
              {notificationData.field === "due" &&
                notificationData.action === "update" && (
                parseInt(notificationData.value, 10) ? (
                  <span>
                    Changed due date of the task&nbsp;
                    &quot;<b>{notificationData.hint}</b>&quot; to &nbsp;
                    <b>{formatDate(notificationData.value)}</b>.
                  </span>
                ) : (
                  <span>
                    Cleared due date of the task&nbsp;
                    &quot;<b>{notificationData.hint}</b>&quot;.
                  </span>
                )
              )}
              {notificationData.field === "status" &&
                notificationData.action === "update" && (
                <span>
                  Changed status of the task&nbsp;
                  &quot;<b>{notificationData.hint}</b>&quot; to &nbsp;
                  <b>{notificationData.value}</b>.
                </span>
              )}
              {notificationData.field === "priority" &&
                notificationData.action === "update" && (
                <span>
                  Changed priority of the task&nbsp;
                  &quot;<b>{notificationData.hint}</b>&quot; to &nbsp;
                  <b>{notificationData.value}</b>.
                </span>
              )}
              {notificationData.field === "comment" &&
                notificationData.action === "create" && (
                <span>
                  Commented&nbsp;
                  &quot;<b>{convertFromRaw(JSON.parse(notificationData.value)).getPlainText()}</b>&quot;&nbsp;
                  on the task:&nbsp;
                  &quot;<b>{notificationData.hint}</b>&quot;.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Notification);
