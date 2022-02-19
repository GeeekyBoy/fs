import React, { Suspense, useState, lazy } from 'react';
import styles from "./index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import parseLinkedList from "../../utils/parseLinkedList";
import ProjectNotSelected from "./ProjectNotSelected";
import * as tasksActions from "../../actions/tasks";
import { READY, LOADING, initTaskState, AuthState } from "../../constants";
import sortedTasks from './sortedTasks';
import ProjectToolbar from './ProjectToolbar';
import TasksToolbar from './TasksToolbar';
import NoTasks from './NoTasks';
import TasksSearch from './TasksSearch';
import ProjectHeader from './ProjectHeader';
import SimpleBar from 'simplebar-react';
import LoginBanner from './LoginBanner';

const TasksPanel = () => {
  const [searchKeyword, setSearchKeyword] = useState("")
  const dispatch = useDispatch();

  const selectedProject = useSelector(state => state.app.selectedProject);
  const isSynced = useSelector(state => state.app.isSynced);

  const tasksSortingCriteria = useSelector(state => state.appSettings.tasksSortingCriteria);

  const tasks = useSelector(state => state.tasks);

  const tasksStatus = useSelector(state => state.status.tasks);

  const user = useSelector(state => state.user);

  const addNewTask = (e) => {
    (e.target.getAttribute("name") === "TasksPanelContainer" ||
    (e.target.className === "simplebar-content-wrapper" && document.querySelector("[name='TasksView']")?.contains(e.target)) ||
    document.querySelector("[name='NoTasks']")?.contains(e.target) && !Object.keys(tasks).length) &&
    tasksStatus === READY &&
    isSynced &&
    dispatch(
      tasksActions.handleCreateTask(
        initTaskState(
          selectedProject,
          parseLinkedList(tasks, "prevTask", "nextTask").reverse()[0]?.id
        )
      )
    )
  }
  return (
    <div
      name="TasksPanelContainer"
      className={[
        styles.TasksPanelContainer,
        ...((tasksStatus === READY ||
          tasksStatus === LOADING) && [styles.ready] || [])
      ].join(" ")}
      onClick={addNewTask}
    >
      {selectedProject ? (
        <>
          {user.state !== AuthState.SignedIn && <LoginBanner />}
          <TasksToolbar
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
          />
          {tasksStatus === LOADING ? (
            <NoTasks msgID="LOADING" />
          ) : (
            <>
              <ProjectHeader />
              {searchKeyword.trim() ? (
                <TasksSearch searchKeyword={searchKeyword} />
              ) : Object.keys(tasks).length ? (
                <SimpleBar name="TasksView" className={styles.TasksView}>
                  {React.createElement(sortedTasks[tasksSortingCriteria])}
                </SimpleBar>
              ) : isSynced ? (
                <NoTasks msgID="EMPTY" />
              ) : (
                  <NoTasks msgID="OFFLINE" />
              )}
            </>
          )}
          <ProjectToolbar />
        </>
      ) : <ProjectNotSelected />}
    </div>
  )
}

export default TasksPanel;
