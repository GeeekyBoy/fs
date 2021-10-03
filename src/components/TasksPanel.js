import React from 'react';
import styledComponents from "styled-components";
import { connect } from "react-redux";
import parseLinkedList from "../utils/parseLinkedList";
import ProjectNotSelected from "./ProjectNotSelected";
import * as appActions from "../actions/app";
import * as tasksActions from "../actions/tasks";
import { OK, initTaskState, panelPages } from "../constants";
import { ReactComponent as ShareIcon } from "../assets/share-outline.svg"
import { ReactComponent as SettingsIcon } from "../assets/settings-outline.svg"
import ProjectTitle from './ProjectTitle';
import sortedTasks from './sortedTasks';

const TasksPanel = (props) => {
  const {
    app: {
      selectedProject,
      taskAddingStatus,
      isLeftPanelOpened,
      leftPanelPage
    },
    appSettings: {
      tasksSortingCriteria
    },
    tasks,
    projects,
    dispatch,
  } = props;
  const addNewTask = (e) => {
    e.target.getAttribute("name") === "TasksPanelContainer" &&
    taskAddingStatus === OK &&
    dispatch(
      tasksActions.handleCreateTask(
        initTaskState(
          selectedProject,
          parseLinkedList(tasks, "prevTask", "nextTask").reverse()[0]?.id
        )
      )
    )
  }
  const openProjectSettings = () => {
    if (!isLeftPanelOpened || (isLeftPanelOpened && leftPanelPage !== panelPages.PROJECT_SETTINGS)) {
      dispatch(appActions.setLeftPanelPage(panelPages.PROJECT_SETTINGS))
      dispatch(appActions.handleSetLeftPanel(true))
    }
  }
  return (
    <TasksPanelContainer
      name="TasksPanelContainer"
      onClick={addNewTask}
    >
      {selectedProject ? (
        <>
          <TasksToolbar>
            <ToolbarAction
              onClick={() => {
                const linkToBeCopied = window.location.href.replace(/\/\d+/, "")
                navigator.clipboard.writeText(linkToBeCopied)
              }}
            >
              <ShareIcon
                width={14}
                height={14}
                strokeWidth={32}
                color="#006EFF"
              />
              <span>Share</span>
            </ToolbarAction>
            <span>
              {projects[selectedProject].permalink}
            </span>
            <ToolbarAction onClick={openProjectSettings}>
              <SettingsIcon
                width={14}
                height={14}
                strokeWidth={32}
                color="#006EFF"
              />
              <span>Settings</span>
            </ToolbarAction>
          </TasksToolbar>
          <ProjectTitle />
          {React.createElement(sortedTasks[tasksSortingCriteria])}
        </>
      ) : <ProjectNotSelected />}
    </TasksPanelContainer>
  )
}

const TasksPanelContainer = styledComponents.div`
  flex: 2;
  padding: 20px 40px 20px 40px;
  overflow: auto;
  background-color: #F8F8F8;
  min-height: calc(100vh - 80px);
  @media only screen and (max-width: 768px) {
		padding: 0px;
    background-color: #F4F7FF;
    width: 100%;
    height: 100%;
  }
`

const TasksToolbar = styledComponents.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin: 0 12px;
  & > span {
    font-size: 12px;
  }
	@media only screen and (max-width: 768px) {
		margin: 20px 20px 10px 20px;
	}
`

const ToolbarAction = styledComponents.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 3px;
  font-size: 12px;
  padding: 5px;
  line-height: 0;
  width: 80px;
  color: #006EFF;
  background-color: #CCE2FF;
  border-radius: 6px;
  outline: none;
  border: none;
  cursor: pointer;
`

export default connect((state) => ({
  tasks: state.tasks,
  app: state.app,
  projects: state.projects,
  user: state.user,
  appSettings: state.appSettings
}))(TasksPanel);
