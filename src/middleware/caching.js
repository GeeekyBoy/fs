import { FETCH_PROJECTS, CREATE_PROJECT, UPDATE_PROJECT, REMOVE_PROJECT } from "../actions/projects"
import { FETCH_TASKS, CREATE_TASK, UPDATE_TASK, REMOVE_TASK } from "../actions/tasks"
import { FETCH_COMMENTS, CREATE_COMMENT, UPDATE_COMMENT, REMOVE_COMMENT } from "../actions/comments"
import { CREATE_HISTORY, FETCH_HISTORY } from "../actions/history"
import { ADD_USERS } from "../actions/users"
import { SET_STATE, SET_DATA } from "../actions/user"
import * as cacheController from "../controllers/cache"
import filterObj from "../utils/filterObj"
import { CREATE_ATTACHMENT, FETCH_ATTACHMENTS } from "../actions/attachments"

export default store => next => action => {
  const {
    app: {
      selectedProject, 
      selectedTask
    }
  } = store.getState()
  let result = next(action)
  if (action.type === FETCH_PROJECTS || action.type === CREATE_PROJECT || action.type === UPDATE_PROJECT || action.type === REMOVE_PROJECT) {
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