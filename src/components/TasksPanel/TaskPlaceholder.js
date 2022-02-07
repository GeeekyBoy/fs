import React from "react";
import * as tasksActions from "../../actions/tasks";
import { connect } from "react-redux";
import { initTaskState, READY } from "../../constants";
import styles from "./TaskPlaceholder.module.scss";
import parseLinkedList from "../../utils/parseLinkedList";

const TaskPlaceholder = (props) => {
  const {
    preset = {},
    content = "Tap to create new task…",
    app: { selectedProject, isSynced },
    status,
    tasks,
    dispatch,
  } = props;
  const addNewTask = () => {
    status.tasks === READY &&
      isSynced &&
      dispatch(
        tasksActions.handleCreateTask(
          initTaskState(
            selectedProject,
            parseLinkedList(tasks, "prevTask", "nextTask").reverse()[0]?.id,
            null,
            preset
          )
        )
      );
  };
  return status.tasks === READY && isSynced ? (
    <span
      name="TaskPlaceholder"
      className={[styles.TaskPlaceholder, "noselect"].join(" ")}
      onClick={addNewTask}
    >
      {content}
    </span>
  ) : null;
};

export default connect((state) => ({
  tasks: state.tasks,
  app: state.app,
  user: state.user,
  status: state.status,
  appSettings: state.appSettings,
}))(TaskPlaceholder);
