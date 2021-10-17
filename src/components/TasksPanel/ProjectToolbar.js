import React, { useContext } from 'react';
import { ThemeContext } from "styled-components";
import styles from "./ProjectToolbar.module.scss"
import { connect } from "react-redux";
import * as appActions from "../../actions/app";
import { panelPages } from "../../constants";
import { ReactComponent as ShareIcon } from "../../assets/share-outline.svg"
import { ReactComponent as SettingsIcon } from "../../assets/settings-outline.svg"

const ProjectToolbar = (props) => {
  const {
    app: {
      selectedProject,
      isLeftPanelOpened,
      leftPanelPage
    },
    projects,
    dispatch,
  } = props;
  const themeContext = useContext(ThemeContext);
  const openProjectSettings = () => {
    if (!isLeftPanelOpened || (isLeftPanelOpened && leftPanelPage !== panelPages.PROJECT_SETTINGS)) {
      dispatch(appActions.setLeftPanelPage(panelPages.PROJECT_SETTINGS))
      dispatch(appActions.handleSetLeftPanel(true))
    }
  }
  return (
    <div className={styles.ToolbarContainer}>
      <button
        className={styles.ToolbarAction}
        onClick={() => {
          const linkToBeCopied = window.location.href.replace(/\/\d+/, "")
          navigator.clipboard.writeText(linkToBeCopied)
        }}
      >
        <ShareIcon
          width={14}
          height={14}
          strokeWidth={32}
          color={themeContext.primary}
        />
        <span>Share</span>
      </button>
      <span>
        {projects[selectedProject].permalink}
      </span>
      <button
        className={styles.ToolbarAction}
        onClick={openProjectSettings}
      >
        <SettingsIcon
          width={14}
          height={14}
          strokeWidth={32}
          color={themeContext.primary}
        />
        <span>Settings</span>
      </button>
    </div>     
  )
}

export default connect((state) => ({
  app: state.app,
  projects: state.projects
}))(ProjectToolbar);
