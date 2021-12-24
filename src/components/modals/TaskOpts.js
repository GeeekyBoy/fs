import React, { useEffect } from 'react';
import { connect } from "react-redux";
import * as appActions from "../../actions/app"
import * as tasksActions from "../../actions/tasks"
import copyTaskCore from "../../utils/copyTask"
import { ReactComponent as RemoveIcon } from "../../assets/trash-outline.svg"
import { ReactComponent as CopyIcon } from "../../assets/copy-outline.svg"
import { ReactComponent as DuplicateIcon } from "../../assets/duplicate-outline.svg"
import { ReactComponent as ShareIcon } from "../../assets/share-outline.svg"
import { ReactComponent as DetailsIcon } from "../../assets/information-circle-outline.svg";
import { ReactComponent as CheckmarkIcon } from "../../assets/checkmark-circle-outline.svg";
import styles from "./TaskOpts.module.scss"
import Modal from '../UI/Modal/';
import { useModal } from '../ModalManager';

const TaskOpts = (props) => {
  
  const {
    app: {
      selectedTask,
      selectedProject,
      isRightPanelOpened
    },
    tasks,
    dispatch
  } = props

  const { modalRef, hideModal } = useModal();

  const copyTask = () => {
    hideModal()
    window.localStorage.setItem(
      "tasksClipboard",
      "COPIEDTASKSTART=>" +
      JSON.stringify(tasks[selectedTask]) +
      "<=COPIEDTASKEND"
    );
  }

  const duplicateTask = () => {
    hideModal()
    dispatch(
      tasksActions.handleCreateTask(
        copyTaskCore(
          tasks[selectedTask],
          selectedProject,
          selectedTask,
          tasks[selectedTask].nextTask
        )
      )
    );
  }

  const shareTask = () => {
    hideModal()
    const linkToBeCopied = window.location.href
    navigator.clipboard.writeText(linkToBeCopied)
  }

  const removeTask = () => {
    hideModal()
    dispatch(
      tasksActions.handleRemoveTask(
        tasks[selectedTask]
      )
    )
  }

  const markTaskAsDone = () => {
    hideModal()
    dispatch(
      tasksActions.handleUpdateTask({
        id: tasks[selectedTask].id,
        status: "done",
      })
    );
  }

  const openRightPanel = () => {
    hideModal()
    if (!isRightPanelOpened) {
      return dispatch(appActions.handleSetRightPanel(true))
    }
  }

  return (
    <Modal
      title="Task Actions"
      primaryButtonText="Cancel"
      onPrimaryButtonClick={hideModal}
      modalRef={modalRef}
    >
      <div className={styles.Actions}>
        <button
          className={styles.Action}
          onClick={copyTask}
        >
          <CopyIcon
            width={24}
            height={24}
            strokeWidth={32}
          />
          <span>Copy</span>
        </button>
        <button
          className={styles.Action}
          onClick={duplicateTask}
        >
          <DuplicateIcon
            width={24}
            height={24}
          />
          <span>Duplicate</span>
        </button>
        <button
          className={styles.Action}
          onClick={shareTask}
        >
          <ShareIcon
            width={24}
            height={24}
          />
          <span>Share</span>
        </button>
        <button
          className={styles.Action}
          onClick={removeTask}
        >
          <RemoveIcon
            width={24}
            height={24}
          />
          <span>Remove</span>
        </button>
        <button
          className={styles.Action}
          onClick={markTaskAsDone}
        >
          <CheckmarkIcon
            width={24}
            height={24}
          />
          <span>Mark As Done</span>
        </button>
        <button
          className={styles.Action}
          onClick={openRightPanel}
        >
          <DetailsIcon
            width={24}
            height={24}
          />
          <span>Details</span>
        </button>
      </div>
    </Modal>
  )
}

export default connect((state) => ({
  user: state.user,
  tasks: state.tasks,
  app: state.app,
  users: state.users
}))(TaskOpts);