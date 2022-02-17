import React, { useRef, useState, useEffect } from 'react';
import loadable from '@loadable/component'
import { connect } from "react-redux";
import styles from "./Notifications.module.scss"
import * as notificationsActions from "../actions/notifications"
const Notification = loadable(() => import('./UI/Notification'));

const Notifications = (props) => {
  const {
    notifications,
    users,
    dispatch
  } = props;
  const dismissTimer = useRef(null)
  const [anim, setAnim] = useState(0)
  const dismissNotification = (e) => {
    if (e) e.stopPropagation()
    clearTimeout(dismissTimer.current)
    setAnim(1)
  }
  const handleAnimationEnd = () => {
    dispatch(notificationsActions.dismiss(notifications.pushed[0]?.id))
    setAnim(0)
  }
  useEffect(() => {
    clearTimeout(dismissTimer.current)
    if (notifications.pushed[0]) {
      dismissTimer.current = setTimeout(dismissNotification, 5000)
    }
  }, [notifications.pushed[0]?.id])
  return (
    <div className={styles.NotificationsContainer}>
      {notifications.pushed[0] && (
        <Notification
          key={notifications.pushed[0]}
          notificationData={notifications.pushed[0]}
          onDismiss={dismissNotification}
          onAnimationEnd={handleAnimationEnd}
          senderData={users[notifications.pushed[0].sender]}
          className={[
            styles.NotificationOverride,
            ...(anim === 0 && [styles.entering] || []),
            ...(anim === 1 && [styles.exiting] || [])
          ].join(" ")}
        />
      )}
    </div>
  );
};

export default connect((state) => ({
  notifications: state.notifications,
  users: state.users,
}))(Notifications);
