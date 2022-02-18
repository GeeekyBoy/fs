import React, { useMemo } from "react";
import * as tasksActions from "../../actions/tasks";
import { connect } from "react-redux";
import { AuthState, initTaskState, READY } from "../../constants";
import styles from "./TaskPlaceholder.module.scss";
import parseLinkedList from "../../utils/parseLinkedList";

const TaskPlaceholder = (props) => {
  const {
    preset = {},
    content = "Tap to create new task…",
    app: { selectedProject, isSynced },
    status,
    projects,
    tasks,
    user,
    dispatch,
  } = props;

  const getReadOnly = (user, projects, selectedProject, isSynced) => {
    return (user.state === AuthState.SignedIn &&
    ((projects[selectedProject]?.owner !== user.data.username &&
    projects[selectedProject]?.permissions === "r") || !isSynced)) ||
    (user.state !== AuthState.SignedIn && projects[selectedProject]?.isTemp)
  }

  const readOnly = useMemo(() => getReadOnly(user, projects, selectedProject, isSynced), [user, projects, selectedProject, isSynced])

  const addNewTask = () => {
      !readOnly &&
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
  return !readOnly && status.tasks === READY && isSynced ? (
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
  app: {
    selectedProject: state.app.selectedProject,
    isSynced: state.app.isSynced,
  },
  user: {
    state: state.user.state,
    data: {
      username: state.user.data.username,
    }
  },
  projects: state.projects,
  status: {
    tasks: state.status.tasks,
  }
}))(TaskPlaceholder);
