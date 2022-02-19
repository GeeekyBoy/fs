import React, { forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { graphqlOperation } from "@aws-amplify/api";
import * as mutations from "../../graphql/mutations"
import * as appActions from "../../actions/app";
import * as notificationsActions from "../../actions/notifications";
import styles from "./Notifications.module.scss"
import { ReactComponent as NoNotificationsIllustration } from "../../assets/undraw_notify_re_65on.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash-outline.svg"
import Notification from '../UI/Notification';
import execGraphQL from '../../utils/execGraphQL';
import { useNavigateNoUpdates } from '../RouterUtils';

const Notifications = forwardRef((_, ref) => {

  const navigate = useNavigateNoUpdates();
  const dispatch = useDispatch();

  const users = useSelector(state => state.users);

  const notifications = useSelector(state => state.notifications);

  const closePanel = () => {
    dispatch(appActions.handleSetLeftPanel(false))
  }
  const dismissNotifications = () => {
    execGraphQL(
      graphqlOperation(
        mutations.dismissNotifications
      )
    ).then(() => {
      dispatch(notificationsActions.emptyNotifications())
    })
  }
  const handleOpenNotification = (link) => {
    navigate(link);
    closePanel()
  }
  useImperativeHandle(ref, () => ({
    panelProps: {
      title: "Notifications",
      actionIcon: RemoveIcon,
      onClose: () => {
        closePanel()
      },
      onAction: () => {
        dismissNotifications();
      }
    }
  }));
  const dismissNotification = (e, id) => {
    e.stopPropagation()
    execGraphQL(
      graphqlOperation(
        mutations.dismissNotification,
        { notificationID: id }
      )
    ).then(() => {
      console.log("Notification dismissed")
    }).catch(err => {
      console.log(err)
    })
  }
  return notifications.stored.length ? notifications.stored.map(x => (
    <Notification
      key={x.id}
      notificationData={x}
      onOpen={handleOpenNotification}
      onDismiss={(e) => dismissNotification(e, x.id)}
      senderData={users[x.sender]}
    />
  )) : (
    <div className={styles.NoNotifications}>
      <NoNotificationsIllustration />
      <span>
        All caught up!
      </span>
    </div>
  )
});

Notifications.displayName = "Notifications";

export default Notifications;
