import React from 'react'
import styles from "./ProjectToolbar.module.scss"
import { useDispatch, useSelector } from "react-redux"
import * as tasksActions from "../../actions/tasks"
import * as appActions from "../../actions/app"
import * as appSettingsActions from "../../actions/appSettings"
import sortByRank from "../../utils/sortByRank"
import copyTask from "../../utils/copyTask"
import { panelPages } from "../../constants";
import { ReactComponent as ClipboardIcon } from "../../assets/clipboard-outline.svg"
import { ReactComponent as ShareIcon } from "../../assets/share-outline.svg"
import { ReactComponent as SettingsIcon } from "../../assets/settings-outline.svg"
import { ReactComponent as ExportIcon } from "../../assets/download-outline.svg"
import { ReactComponent as ImportIcon } from "../../assets/cloud-upload-outline.svg"
import ComboBox from '../UI/fields/ComboBox';
import ShadowScroll from '../ShadowScroll';
import { useModal } from '../ModalManager';
import modals from '../modals';
import generateRank from '../../utils/generateRank'

const ProjectToolbar = () => {
  const { showModal } = useModal();
  const dispatch = useDispatch();

  const selectedProject = useSelector(state => state.app.selectedProject);

  const tasks = useSelector(state => state.tasks);

  const tasksSortingCriteria = useSelector(state => state.appSettings.tasksSortingCriteria);

  const openProjectSettings = () => {
    dispatch(appActions.setLeftPanelPage(panelPages.PROJECT_SETTINGS))
    dispatch(appActions.handleSetLeftPanel(true))
  }
  const openExportModal = () => {
    showModal(modals.EXPORT)
  }
  const openImportModal = () => {
    showModal(modals.IMPORT)
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
                generateRank(sortByRank(tasks, true)[0]?.rank)
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
      <ShadowScroll style={{ maxWidth: "fit-content" }}>
        <div className={styles.SortingSettings}>
          <ComboBox
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
          onClick={openImportModal}
        >
          <ImportIcon
            width={14}
            height={14}
          />
          <span>Import</span>
        </button>
        <button
          className={styles.ToolbarActionBtn}
          onClick={openExportModal}
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
      </ShadowScroll>
    </div>     
  )
}

export default ProjectToolbar;
