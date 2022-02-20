import React, { useMemo } from "react";
import * as tasksActions from "../../actions/tasks";
import { useDispatch, useSelector } from "react-redux";
import { AuthState, initTaskState, READY } from "../../constants";
import styles from "./TaskPlaceholder.module.scss";
import parseLinkedList from "../../utils/parseLinkedList";

const TaskPlaceholder = (props) => {
  const {
    preset = {},
    content = "Tap to create new task…",
  } = props;

  const dispatch = useDispatch();

  const selectedProject = useSelector(state => state.app.selectedProject);
  const isSynced = useSelector(state => state.app.isSynced);

  const tasks = useSelector(state => state.tasks);

  const tasksStatus = useSelector(state => state.status.tasks);

  const projects = useSelector(state => state.projects);

  const user = useSelector(state => state.user);

  const getReadOnly = (user, projects, selectedProject, isSynced) => {
    return (user.state === AuthState.SignedIn &&
    ((projects[selectedProject]?.owner !== user.data.username &&
    projects[selectedProject]?.permissions === "r") || !isSynced)) ||
    (user.state !== AuthState.SignedIn && projects[selectedProject]?.isTemp)
  }

  const readOnly = useMemo(() => getReadOnly(user, projects, selectedProject, isSynced), [user, projects, selectedProject, isSynced])

  const addNewTask = () => {
      !readOnly &&
      tasksStatus === READY &&
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
  return !readOnly && tasksStatus === READY && isSynced ? (
    <span
      name="TaskPlaceholder"
      className={[styles.TaskPlaceholder, "noselect"].join(" ")}
      onClick={addNewTask}
    >
      {content}
    </span>
  ) : null;
};

export default TaskPlaceholder;
