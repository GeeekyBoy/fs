import React from 'react'
import styles from "./ProjectToolbar.module.scss"
import { connect } from "react-redux"
import * as tasksActions from "../../actions/tasks"
import * as appActions from "../../actions/app"
import * as appSettingsActions from "../../actions/appSettings"
import parseLinkedList from "../../utils/parseLinkedList"
import copyTask from "../../utils/copyTask"
import { panelPages } from "../../constants";
import { ReactComponent as ClipboardIcon } from "../../assets/clipboard-outline.svg"
import { ReactComponent as ShareIcon } from "../../assets/share-outline.svg"
import { ReactComponent as SettingsIcon } from "../../assets/settings-outline.svg"
import { ReactComponent as ExportIcon } from "../../assets/download-outline.svg"
import { ReactComponent as ImportIcon } from "../../assets/cloud-upload-outline.svg"
import { ReactComponent as UndoIcon } from "../../assets/arrow-undo-outline.svg"
import { ReactComponent as RedoIcon } from "../../assets/arrow-redo-outline.svg"
import Dropdown from '../UI/fields/Dropdown';
import ShadowScroll from '../ShadowScroll'

const ProjectToolbar = (props) => {
  const {
    app: {
      selectedProject,
      isLeftPanelOpened,
      leftPanelPage
    },
    tasks,
    appSettings: {
      tasksSortingCriteria
    },
    dispatch,
  } = props;
  const openProjectSettings = () => {
    if (!isLeftPanelOpened || (isLeftPanelOpened && leftPanelPage !== panelPages.PROJECT_SETTINGS)) {
      dispatch(appActions.setLeftPanelPage(panelPages.PROJECT_SETTINGS))
      dispatch(appActions.handleSetLeftPanel(true))
    }
  }
  const pasteTask = () => {
    const tasksClipboardData = window.localStorage.getItem("tasksClipboard")
    if (tasksClipboardData) {
      const stringifiedTaskState = /COPIEDTASKSTART=>({.+})<=COPIEDTASKEND/.exec(tasksClipboardData)[1]
      if (stringifiedTaskState) {
        const taskState = JSON.parse(stringifiedTaskState)
        if (taskState) {
          dispatch(tasksActions.handleCreateTask(
              copyTask(
                taskState,
                selectedProject,
                parseLinkedList(
                  tasks,
                  "prevTask",
                  "nextTask"
                ).reverse()[0]?.id
              )
            )
          )
        }
      }
    }
  }
  const handleChangeSortingCriteria = (e) => {
    dispatch(
      appSettingsActions.handleSetTasksSortingCriteria(
        e.target.value
      )
    )
  }
  return (
    <div className={styles.ToolbarContainer}>
      <ShadowScroll>
        <button
          className={styles.ToolbarActionBtn}
          onClick={pasteTask}
        >
          <UndoIcon
            width={14}
            height={14}
          />
          <span>Undo</span>
        </button>
        <button
          className={styles.ToolbarActionBtn}
          onClick={pasteTask}
        >
          <RedoIcon
            width={14}
            height={14}
          />
          <span>Redo</span>
        </button>
        <button
          className={styles.ToolbarActionBtn}
          onClick={pasteTask}
        >
          <ClipboardIcon
            width={14}
            height={14}
          />
          <span>Paste</span>
        </button>
        <button
          className={styles.ToolbarActionBtn}
          onClick={pasteTask}
        >
          <ImportIcon
            width={14}
            height={14}
          />
          <span>Import</span>
        </button>
        <button
          className={styles.ToolbarActionBtn}
          onClick={pasteTask}
        >
          <ExportIcon
            width={14}
            height={14}
          />
          <span>Export</span>
        </button>
        <button
          className={styles.ToolbarActionBtn}
          onClick={() => {
            const linkToBeCopied = window.location.href.replace(/\/\d+/, "")
            navigator.clipboard.writeText(linkToBeCopied)
          }}
        >
          <ShareIcon
            width={14}
            height={14}
          />
          <span>Share</span>
        </button>
        <button
          className={styles.ToolbarActionBtn}
          onClick={openProjectSettings}
        >
          <SettingsIcon
            width={14}
            height={14}
          />
          <span>Settings</span>
        </button>
        <div className={styles.SortingSettings}>
          <Dropdown
            onChange={handleChangeSortingCriteria}
            value={tasksSortingCriteria}
            options={{
              BY_DEFAULT: "by default",
              BY_DUE: "by due",
              BY_STATUS: "by status",
              BY_PRIORITY: "by priority",
              BY_TAG: "by tag"
            }}
          />
        </div>
      </ShadowScroll>
    </div>     
  )
}

export default connect((state) => ({
  app: state.app,
  tasks: state.tasks,
  appSettings: state.appSettings
}))(ProjectToolbar);
