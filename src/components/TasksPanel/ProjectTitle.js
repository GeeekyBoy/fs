import React from 'react';
import styles from "./ProjectTitle.module.scss"
import { useDispatch, useSelector } from "react-redux";
import * as appActions from "../../actions/app"
import * as projectsActions from "../../actions/projects"
import * as tasksActions from "../../actions/tasks"
import { initTaskState, OK } from '../../constants';
import parseLinkedList from '../../utils/parseLinkedList';

const ProjectTitle = (props) => {

  const {
    readOnly
  } = props;

  const dispatch = useDispatch();

  const isProjectTitleSelected = useSelector(state => state.app.isProjectTitleSelected);
  const selectedProject = useSelector(state => state.app.selectedProject);
  const taskAddingStatus = useSelector(state => state.app.taskAddingStatus);

  const projects = useSelector(state => state.projects);

  const tasks = useSelector(state => state.tasks);

  const onChange = (e) => {
    dispatch(projectsActions.handleUpdateProject({
      id: selectedProject,
      title: e.target.value
    }))
  };

  const onKeyUp = (e) => {
    const firstTask = parseLinkedList(tasks, "prevTask", "nextTask")[0]?.id
    if (e.key === "Enter") {
      if (taskAddingStatus === OK) {
        appActions.handleSetProjectTitle(false)
        dispatch(
          tasksActions.handleCreateTask(
            initTaskState(
              selectedProject,
              null,
              firstTask
            )
          )
        )
      }
    } else if (e.key === "ArrowDown") {
      dispatch(appActions.handleSetProjectTitle(false))
      if (firstTask) {
        return dispatch(appActions.handleSetTask(firstTask))
      }
    } else if (e.key === "Escape") {
      return dispatch(appActions.handleSetProjectTitle(false))
    }
  };

  const selectTitle = () => {
    dispatch(appActions.handleSetProjectTitle(true))
  }

  return (
    <div className={styles.ProjectTitleShell}>
      {isProjectTitleSelected ? (
        <div className={styles.ProjectTitleInput}>
          <input
            type="text"
            placeholder="Project Title…"
            value={projects[selectedProject].title || ""}
            onKeyUp={onKeyUp}
            onChange={onChange}
            autoFocus={true}
            readOnly={readOnly}
          />
        </div>
      ) : (
        <span
          className={[
            styles.ProjectTitleHeader,
            ...(!projects[selectedProject].title && [styles.placeholder] || [])
          ].join(" ")}
          onClick={selectTitle}
        >
          {projects[selectedProject].title || "Project Title…"}
        </span>
      )}
    </div>
  );
};

export default ProjectTitle;
