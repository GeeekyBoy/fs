import React, { Suspense, useState, lazy } from 'react';
import styles from "./index.module.scss";
import { connect } from "react-redux";
import parseLinkedList from "../../utils/parseLinkedList";
import ProjectNotSelected from "./ProjectNotSelected";
import * as tasksActions from "../../actions/tasks";
import { READY, LOADING, initTaskState, AuthState } from "../../constants";
import sortedTasks from './sortedTasks';
const ProjectToolbar = lazy(() => import('./ProjectToolbar'));
const TasksToolbar = lazy(() => import('./TasksToolbar'));
const NoTasks = lazy(() => import('./NoTasks'));
const TasksSearch = lazy(() => import('./TasksSearch'));
const ProjectHeader = lazy(() => import('./ProjectHeader'));
const SimpleBar = lazy(() => import('simplebar-react'));
const LoginBanner = lazy(() => import('./LoginBanner'));

const TasksPanel = (props) => {
  const {
    app: {
      selectedProject,
      isSynced
    },
    appSettings: {
      tasksSortingCriteria
    },
    user,
    status,
    tasks,
    dispatch,
  } = props;
  const [searchKeyword, setSearchKeyword] = useState("")
  const addNewTask = (e) => {
    (e.target.getAttribute("name") === "TasksPanelContainer" ||
    (e.target.className === "simplebar-content-wrapper" && document.querySelector("[name='TasksView']")?.contains(e.target)) ||
    document.querySelector("[name='NoTasks']")?.contains(e.target) && !Object.keys(tasks).length) &&
    status.tasks === READY &&
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
    <Suspense fallback={<div>Loading...</div>}>
    <div
      name="TasksPanelContainer"
      className={[
        styles.TasksPanelContainer,
        ...((status.tasks === READY ||
          status.tasks === LOADING) && [styles.ready] || [])
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
          {status.tasks === LOADING ? (
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
    </Suspense>
  )
}

export default connect((state) => ({
  tasks: state.tasks,
  app: {
    selectedProject: state.app.selectedProject,
    isSynced: state.app.isSynced
  },
  user: {
    state: state.user.state
  },
  status: {
    tasks: state.status.tasks
  },
  appSettings: {
    tasksSortingCriteria: state.appSettings.tasksSortingCriteria
  }
}))(TasksPanel);
