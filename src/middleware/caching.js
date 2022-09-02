import * as cacheController from "../controllers/cache"
import filterObj from "../utils/filterObj"

const FETCH_NOTIFICATIONS = "FETCH_NOTIFICATIONS";
const ADD_NOTIFICATION = "ADD_NOTIFICATION";
const REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION";
const EMPTY_NOTIFICATIONS = "EMPTY_NOTIFICATIONS";

const FETCH_PROJECTS = "FETCH_PROJECTS";
const CREATE_PROJECT = "CREATE_PROJECT";
const UPDATE_PROJECT = "UPDATE_PROJECT";
const REMOVE_PROJECT = "REMOVE_PROJECT";

const FETCH_TASKS = "FETCH_TASKS";
const CREATE_TASK = "CREATE_TASK";
const UPDATE_TASK = "UPDATE_TASK";
const REMOVE_TASK = "REMOVE_TASK";

const FETCH_COMMENTS = "FETCH_COMMENTS";
const CREATE_COMMENT = "CREATE_COMMENT";
const UPDATE_COMMENT = "UPDATE_COMMENT";
const REMOVE_COMMENT = "REMOVE_COMMENT";

const CREATE_HISTORY = "CREATE_HISTORY";
const FETCH_HISTORY = "FETCH_HISTORY";

const ADD_USERS = "ADD_USERS";

const SET_STATE = "SET_STATE";
const SET_DATA = "SET_DATA";

const CREATE_ATTACHMENT = "CREATE_ATTACHMENT";
const FETCH_ATTACHMENTS = "FETCH_ATTACHMENTS";

const cachingMiddleware = store => next => action => {
  const {
    app: {
      selectedProject, 
      selectedTask
    }
  } = store.getState()
  let result = next(action)
  if (action.type === FETCH_NOTIFICATIONS || action.type === ADD_NOTIFICATION || action.type === REMOVE_NOTIFICATION || action.type === EMPTY_NOTIFICATIONS) {
    cacheController.setNotifications(store.getState().notifications.stored)
  } else if (action.type === FETCH_PROJECTS || action.type === CREATE_PROJECT || action.type === UPDATE_PROJECT || action.type === REMOVE_PROJECT) {
    cacheController.setProjects(filterObj(store.getState().projects, x => x.isOwned || x.isAssigned || x.isWatched))
  } else if (action.type === FETCH_TASKS) {
    cacheController.setTasksByProjectId(action.projectId, store.getState().tasks)
  } else if (action.type === CREATE_TASK || action.type === UPDATE_TASK || action.type === REMOVE_TASK) {
    const tasks = store.getState().tasks
    const projectId = Object.values(tasks)?.[0]?.projectId || selectedProject
    if (projectId) {
      cacheController.setTasksByProjectId(projectId, tasks)
    }
  } else if (action.type === FETCH_COMMENTS) {
    cacheController.setCommentsByTaskId(action.taskId, store.getState().comments)
  } else if (action.type === CREATE_COMMENT || action.type === UPDATE_COMMENT || action.type === REMOVE_COMMENT) {
    const comments = store.getState().comments
    const taskId = Object.values(comments)?.[0]?.taskId || selectedTask
    if (taskId) {
      cacheController.setCommentsByTaskId(taskId, comments)
    }
  } else if (action.type === FETCH_HISTORY) {
    cacheController.setHistoryByTaskId(action.taskId, store.getState().history)
  } else if (action.type === CREATE_HISTORY) {
    const history = store.getState().history
    if (selectedTask) {
      cacheController.setHistoryByTaskId(selectedTask, history)
    }
  } else if (action.type === FETCH_ATTACHMENTS) {
    cacheController.setAttachmentsByTaskId(action.taskId, store.getState().attachments)
  } else if (action.type === CREATE_ATTACHMENT) {
    const attachments = store.getState().attachments
    if (selectedTask) {
      cacheController.setAttachmentsByTaskId(selectedTask, attachments)
    }
  }  else if (action.type === ADD_USERS) {
    cacheController.setUsers(store.getState().users)
  } else if (action.type === SET_STATE || action.type === SET_DATA) {
    cacheController.setUser(store.getState().user)
  }
  return result
}

export default cachingMiddleware;
