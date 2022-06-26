import React from 'react';
import styles from "./Toolbar.module.scss"
import * as appActions from "../actions/app"
import { useDispatch, useSelector } from "react-redux";
import { panelPages, AuthState } from "../constants"
import { ReactComponent as ProjectsIcon } from "../assets/albums-outline.svg"
import { ReactComponent as NotificationIcon } from "../assets/notifications-outline.svg"
import { ReactComponent as SettingsIcon } from "../assets/settings-outline.svg"
import { ReactComponent as LoginIcon } from "../assets/person-circle-outline.svg"
import Avatar from './UI/Avatar';
import { navigate } from './Router';

const Toolbar = () => {
  const dispatch = useDispatch();

  const isLeftPanelOpened = useSelector(state => state.app.isLeftPanelOpened);
  const leftPanelPage = useSelector(state => state.app.leftPanelPage);

  const user = useSelector(state => state.user);

  const openLeftPanel = (page) => {
    if (!isLeftPanelOpened || (isLeftPanelOpened && leftPanelPage !== page)) {
      dispatch(appActions.setLeftPanelPage(page))
      dispatch(appActions.handleSetLeftPanel(true))
    } else {
      dispatch(appActions.handleSetLeftPanel(false))
    }
  }
  const goToLoginPage = () => {
    dispatch(appActions.handleSetTask(null))
    return navigate("/login")
  }
  return (
    <div
      className={[
        styles.ToolbarContainer,
        ...(isLeftPanelOpened ? [styles.selected] : []),
        "no-keyboard-portrait-flex"
      ].join(" ")}
    >
      <div className={styles.TopControls}>
        <span className={styles.Logo}>/.</span>
        <div className={styles.Spacer} />
        <button
          className={[
            styles.ToolbarAction,
            ...(isLeftPanelOpened && leftPanelPage === panelPages.NOTIFICATIONS ? [styles.selected] : [])
          ].join(" ")}
          onClick={() => openLeftPanel(panelPages.NOTIFICATIONS)}
        >
          <NotificationIcon
            width={24}
            height={24}
          />
          <span>Updates</span>
        </button>
        <button
          className={[
            styles.ToolbarAction,
            ...(isLeftPanelOpened && leftPanelPage === panelPages.PROJECTS ? [styles.selected] : [])
          ].join(" ")}
          onClick={() => openLeftPanel(panelPages.PROJECTS)}
        >
          <ProjectsIcon
            width={24}
            height={24}
          />
          <span>Projects</span>
        </button>
        <button
          className={[
            styles.ToolbarAction,
            ...(isLeftPanelOpened && leftPanelPage === panelPages.APP_SETTINGS ? [styles.selected] : [])
          ].join(" ")}
          onClick={() => openLeftPanel(panelPages.APP_SETTINGS)}
        >
          <SettingsIcon
            width={24}
            height={24}
          />
          <span>Settings</span>
        </button>
      </div>
      <div className={styles.BottomControls}>
          {user.state === AuthState.SignedIn ? (
              <button
                className={styles.AvatarBtn}
                style={{ padding: 0 }}
                onClick={() => openLeftPanel(panelPages.ACCOUNT_SETTINGS)}
              >
                <Avatar user={user.data} size={42} />
              </button>
          ) : (
            <button
              className={[
                styles.ToolbarAction,
                styles.LoginBtn
              ].join(" ")}
              onClick={goToLoginPage}
            >
              <LoginIcon
                width={32}
                height={32}
              />
            </button>
          )}
      </div>
    </div>
  );
};

export default Toolbar;
