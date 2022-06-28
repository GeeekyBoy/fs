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
import Button from '../UI/Button'

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
        {/* <div className={styles.SortingSettings}>
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
        </div> */}
        <Button
          icon={ClipboardIcon}
          onClick={pasteTask}
        >
          Paste
        </Button>
        <Button
          icon={ImportIcon}
          onClick={openImportModal}
        >
          Import
        </Button>
        <Button
          icon={ExportIcon}
          onClick={openExportModal}
        >
          Export
        </Button>
        <Button
          icon={ShareIcon}
          onClick={() => {
            const linkToBeCopied = window.location.href.replace(/\/\d+/, "")
            navigator.clipboard.writeText(linkToBeCopied)
          }}
        >
          Share
        </Button>
        <Button
          icon={SettingsIcon}
          onClick={openProjectSettings}
        >
          Settings
        </Button>
      </ShadowScroll>
    </div>     
  )
}

export default ProjectToolbar;
