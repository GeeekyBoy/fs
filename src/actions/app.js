import { panelPages, AuthState } from "../constants"
import * as tasksActions from "./tasks"
import * as collaborationActions from "./collaboration"
import * as commentsActions from "./comments"
import { navigate } from "../components/Router"
import PubSub from "../amplify/PubSub"

export const SET_PROJECT = "SET_PROJECT";
export const SET_TASK = "SET_TASK";
export const SET_COMMAND = "SET_COMMAND";
export const SET_PROJECT_ADDING_STATUS = "SET_PROJECT_ADDING_STATUS";
export const SET_TASK_ADDING_STATUS = "SET_TASK_ADDING_STATUS";
export const SET_NAVIGATE = "SET_NAVIGATE";
export const SET_OFFLINE = "SET_OFFLINE";
export const SET_SYNCED = "SET_SYNCED";
export const SET_PROJECT_PANEL = "SET_PROJECT_PANEL";
export const SET_DETAILS_PANEL = "SET_DETAILS_PANEL";
export const SET_PROJECT_TITLE = "SET_PROJECT_TITLE";
export const SET_LOCKED_TASK_FIELD = "SET_LOCKED_TASK_FIELD";
export const SET_RIGHT_PANEL_PAGE = "SET_RIGHT_PANEL_PAGE";
export const SET_LEFT_PANEL_PAGE = "SET_LEFT_PANEL_PAGE";

const setProject = (id) => ({
  type: SET_PROJECT,
  id
});

const setTask = (id) => ({
  type: SET_TASK,
  id
});

const setProjectTitle = (status) => ({
  type: SET_PROJECT_TITLE,
  status
});

const setLeftPanel = (status) => ({
  type: SET_PROJECT_PANEL,
  status
});

const setRightPanel = (status) => ({
  type: SET_DETAILS_PANEL,
  status
});

export const setCommand = (command) => ({
  type: SET_COMMAND,
  command
});

export const setOffline = (isOffline) => ({
  type: SET_OFFLINE,
  isOffline
});

export const setSynced = (isSynced) => ({
  type: SET_SYNCED,
  isSynced
});

export const setRightPanelPage = (page) => ({
  type: SET_RIGHT_PANEL_PAGE,
  page
});

export const setLeftPanelPage = (page) => ({
  type: SET_LEFT_PANEL_PAGE,
  page
});

export const setLockedTaskField = (fieldName) => ({
  type: SET_LOCKED_TASK_FIELD,
  fieldName
});

export const setProjectAddingStatus = (status) => ({
  type: SET_PROJECT_ADDING_STATUS,
  status
});

export const setTaskAddingStatus = (status) => ({
  type: SET_TASK_ADDING_STATUS,
  status
});

export const setNavigate = (navigate) => ({
  type: SET_NAVIGATE,
  navigate
});

export const handleSetProject = (id, shouldChangeURL = true) => (dispatch, getState) => {
  const { user, app, projects } = getState()
  if (app.selectedProject !== id) {
    PubSub.unsubscribeTopic("tasks")
    dispatch(handleSetTask(null, shouldChangeURL));
    dispatch(tasksActions.emptyTasks());
    if (id) {
      if (projects[id]) {
        dispatch(setProject(id))
        if (shouldChangeURL) {
          if (user.state === AuthState.SignedIn || projects[id].isTemp) {
            navigate(`/${projects[id].permalink}`)
          } else {
            navigate(`/local/${projects[id].permalink}`)
          }
        }
      }
      if (!getState().projects[id].isVirtual) {
        dispatch(tasksActions.handleFetchTasks(id))
        if (user.state === AuthState.SignedIn || projects[id].isTemp) {
          if (user.state === AuthState.SignedIn) {
            dispatch(collaborationActions.handleJoinProject(id))
          }
          PubSub.subscribeTopic("tasks", id)
        }
      }
    } else {
      if (shouldChangeURL) {
        navigate("/")
      }
      dispatch(setProject(null))
    }
  }
}

export const handleSetTask = (id, shouldChangeURL = true) => (dispatch, getState) => {
  const { user, projects, tasks, app } = getState()
  PubSub.unsubscribeTopic("comments")
  dispatch(commentsActions.emptyComments())
  dispatch(setProjectTitle(false))
  if (id !== app.selectedTask) dispatch(setCommand(""))
  if (!id && app.selectedTask) {
    if (user.state === AuthState.SignedIn) {
      dispatch(collaborationActions.handleSendAction({
        action: "UNFOCUS_TASK",
        taskID: app.selectedTask
      }))
    }
    if (app.isRightPanelOpened) {
      dispatch(setRightPanel(false))
    }
    if (shouldChangeURL) {
      if (app.selectedProject && (user.state === AuthState.SignedIn || projects[app.selectedProject].isTemp)) {
        navigate(`/${projects[app.selectedProject].permalink}`)
      }
    }
    dispatch(setTask(null))
  } else if (!id) {
    if (app.isRightPanelOpened) {
      dispatch(setRightPanel(false))
    }
    dispatch(setTask(null))
  } else {
    if (app.selectedTask && app.isRightPanelOpened && app.rightPanelPage !== panelPages.TASK_HUB) {
      dispatch(setRightPanelPage(panelPages.TASK_HUB))
    }
    if (shouldChangeURL) {
      if (app.selectedProject && (user.state === AuthState.SignedIn || projects[app.selectedProject].isTemp)) {
        navigate(`/${projects[app.selectedProject].permalink}/${tasks[id].permalink}`)
      }
    }
    dispatch(setTask(id))
    dispatch(setLockedTaskField(null))
    if (!tasks[id].isVirtual) {
      dispatch(commentsActions.handleFetchComments(id))
      if (user.state === AuthState.SignedIn) {
        dispatch(collaborationActions.handleSendAction({
          action: "FOCUS_TASK",
          taskID: id
        }))
        PubSub.subscribeTopic("comments", id)
      }
    }
  }
}

export const handleSetProjectTitle = (status) => (dispatch) => {
  if (status) {
    dispatch(handleSetTask(null))
  }
  return dispatch(setProjectTitle(status))
}

export const handleSetRightPanel = (status) => (dispatch, getState) => {
  const { app: { isLeftPanelOpened } } = getState()
  if (status && isLeftPanelOpened) {
    dispatch(setLeftPanel(false))
  }
  return dispatch(setRightPanel(status))
}

export const handleSetLeftPanel = (status) => (dispatch, getState) => {
  const { app: { isRightPanelOpened } } = getState()
  if (status && isRightPanelOpened) {
    dispatch(setRightPanel(false))
  }
  return dispatch(setLeftPanel(status))
}