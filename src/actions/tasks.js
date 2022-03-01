import { AuthState } from '../constants';
import { listTasksForProject } from "../graphql/queries"
import * as appActions from "./app"
import * as statusActions from "./status"
import * as projectsActions from "./projects"
import * as usersActions from "./users"
import * as commentsActions from "./comments"
import * as cacheController from "../controllers/cache"
import { READY, LOADING } from "../constants";
import prepareTaskToBeSent from "../utils/prepareTaskToBeSent";
import API from '../amplify/API';
import PubSub from '../amplify/PubSub';

export const CREATE_TASK = "CREATE_TASK";
export const UPDATE_TASK = "UPDATE_TASK";
export const REMOVE_TASK = "REMOVE_TASK";
export const EMPTY_TASKS = "EMPTY_TASKS";
export const FETCH_TASKS = "FETCH_TASKS";
export const FETCH_CACHED_TASKS = "FETCH_CACHED_TASKS";

export const createTask = (taskState) => ({
  type: CREATE_TASK,
  taskState
});

export const updateTask = (update) => ({
  type: UPDATE_TASK,
  update
});

export const removeTask = (id) => ({
  type: REMOVE_TASK,
  id
});

export const emptyTasks = () => ({
  type: EMPTY_TASKS
});

const fetchTasks = (tasks, projectID) => ({
  type: FETCH_TASKS,
  tasks,
  projectID
});

const fetchCachedTasks = (tasks) => ({
  type: FETCH_CACHED_TASKS,
  tasks
});

export const handleCreateTask = (taskState) => (dispatch, getState) => {
  const { app, user, projects } = getState()
  if (user.state === AuthState.SignedIn) {
    const dataToSend = prepareTaskToBeSent(taskState, user.data.username)
    if (taskState.projectID === getState().app.selectedProject) {
      dispatch(createTask({
        watchers: [],
        permalink: projects[app.selectedProject].tasksCount + 1,
        owner: user.data.username,
        isVirtual: true,
        ...taskState
      }))
      dispatch(appActions.handleSetTask(taskState.id))
    }
    API.mutate({
      type: "createTask",
      variables: dataToSend,
      success: (incoming) => {
        dispatch(updateTask({
          id: incoming.data.createTask.id,
          permalink: incoming.data.createTask.permalink,
          isVirtual: false
        }))
        if (getState().app.selectedTask === taskState.id) {
          dispatch(commentsActions.handleFetchComments(taskState.id))
          PubSub.subscribeTopic("comments", taskState.id)
        }
      },
      error: () => {
        if (getState().app.selectedTask === taskState.id) {
          dispatch(appActions.handleSetTask(null))
        }
        dispatch(removeTask(taskState.id))
      }
    })
  } else {
    if (taskState.projectID === getState().app.selectedProject) {
      dispatch(createTask(taskState))
      dispatch(projectsActions.handleUpdateTaskCount(taskState.projectID, null, taskState.status))
      dispatch(appActions.handleSetTask(taskState.id))
    }
  }
}

export const handleUpdateTask = (update) => (dispatch, getState) => {
  const { user, tasks } = getState()
  const prevTaskState = {...tasks[update.id]}
  if (update.task !== null && update.task !== undefined) {
    const tokens = /^(.*?)(\/.*||)$/m.exec(update.task)
    update.task = tokens[1];
    dispatch(appActions.setCommand(tokens[2]))
  }
  if (tasks[update.id]) {
    dispatch(updateTask(update))
  }
  if (user.state === AuthState.SignedIn) {
    API.mutate({
      type: "updateTask",
      variables: update,
      success: null,
      error: () => {
        if (getState().tasks[update.id]) {
          dispatch(updateTask(prevTaskState))
        }
      }
    })
  } else {
    if (tasks[update.id]) {
      if (update.status && prevTaskState.status !== update.status) {
        dispatch(projectsActions.handleUpdateTaskCount(prevTaskState.projectID, prevTaskState.status, update.status))
      }
    }
  }
}

export const handleRemoveTask = (taskState) => (dispatch, getState) => {
  const { user, tasks, app } = getState()
  if (app.selectedTask === taskState.id) {
    dispatch(appActions.handleSetTask(taskState.prevTask))
  }
  if (tasks[taskState.id]) {
    dispatch(removeTask(taskState.id))
  }
  if (user.state === AuthState.SignedIn) {
    API.mutate({
      type: "deleteTaskAndComments",
      variables: { id: taskState.id },
      success: null,
      error: () => {
        if (getState().app.selectedProject === taskState.projectID) {
          dispatch(createTask(taskState))
        }
      }
    })
  } else {
    if (tasks[taskState.id]) {
      dispatch(projectsActions.handleUpdateTaskCount(taskState.projectID, taskState.status, null))
    }
  }
}

export const handleAssignTask = (taskID, username) => async (dispatch, getState) => {
  const { tasks, user } = getState()
  const prevAssignees = [...tasks[taskID].assignees]
  if (user.state === AuthState.SignedIn) {
    if (/^user:.*$/.test(username)) {
      await dispatch(usersActions.handleAddUsers([username.replace(/^user:/, "")]))
    }
    dispatch(updateTask({
      id: taskID,
      assignees: [...new Set([...prevAssignees, username])]
    }))
    API.mutate({
      type: "assignTask",
      variables: { id: taskID, assignee: username },
      success: null,
      error: () => {
        if (getState().tasks[taskID]) {
          dispatch(updateTask({
            id: taskID,
            assignees: prevAssignees
          }))
        }
      }
    })
  } else if (/^anonymous:.*$/.test(username)) {
    dispatch(updateTask({
      id: taskID,
      assignees: [...new Set([...prevAssignees, username])]
    }))
  }
}

export const handleAddWatcher = (taskID, username) => async (dispatch, getState) => {
  const { tasks, user } = getState()
  if (user.state === AuthState.SignedIn) {
    const prevWatchers = [...tasks[taskID].watchers]
    dispatch(updateTask({
      id: taskID,
      watchers: [...new Set([...prevWatchers, username])]
    }))
    await dispatch(usersActions.handleAddUsers([username]))
    API.mutate({
      type: "addWatcher",
      variables: { id: taskID, watcher: username },
      success: null,
      error: () => {
        if (getState().tasks[taskID]) {
          dispatch(updateTask({
            id: taskID,
            watchers: prevWatchers
          }))
        }
      }
    })
  }
}

export const handleUnassignTask = (taskID, username) => async (dispatch, getState) => {
  const { tasks, user } = getState()
  const prevAssignees = [...tasks[taskID].assignees]
  dispatch(updateTask({
    id: taskID,
    assignees: [...prevAssignees].filter(x => x !== username)
  }))
  if (user.state === AuthState.SignedIn) {
    API.mutate({
      type: "unassignTask",
      variables: { id: taskID, assignee: username },
      success: null,
      error: () => {
        if (getState().tasks[taskID]) {
          dispatch(updateTask({
            id: taskID,
            assignees: prevAssignees
          }))
        }
      }
    })
  }
}

export const handleRemoveWatcher = (taskID, username) => async (dispatch, getState) => {
  const { tasks, user } = getState()
  if (user.state === AuthState.SignedIn) {
    const prevWatchers = [...tasks[taskID].watchers]
    dispatch(updateTask({
      id: taskID,
      watchers: [...prevWatchers].filter(x => x !== username)
    }))
    API.mutate({
      type: "removeWatcher",
      variables: { id: taskID, watcher: username },
      success: null,
      error: () => {
        if (getState().tasks[taskID]) {
          dispatch(updateTask({
            id: taskID,
            watchers: prevWatchers
          }))
        }
      }
    })
  }
}

export const handleFetchTasks = (projectID, isInitial = false) => async (dispatch, getState) => {
  const { user, projects } = getState()
  if (!isInitial) {
    dispatch(appActions.handleSetTask(null))
  }
  if (user.state === AuthState.SignedIn || projects[projectID].isTemp) {
    try {
      dispatch(statusActions.setTasksStatus(LOADING))
      const res = await API.execute(listTasksForProject, { projectID })
      const items = res.data.listTasksForProject.items
      let usersToBeFetched = []
      for (const item of items) {
        usersToBeFetched = [...new Set([
          ...usersToBeFetched,
          ...item.assignees.filter(x => /^user:.*$/.test(x)).map(x => x.replace(/^user:/, "")),
          ...item.watchers
        ])]
      }
      await dispatch(usersActions.handleAddUsers(usersToBeFetched))
      dispatch(fetchTasks(items, projectID))
      dispatch(statusActions.setTasksStatus(READY))
    } catch (err) {
      dispatch(statusActions.setTasksStatus(READY))
      if (err.errors[0].message === 'Network Error') {
        dispatch(fetchCachedTasks(cacheController.getTasksByProjectID(projectID)))
      }
    }
  } else {
    dispatch(fetchCachedTasks(cacheController.getTasksByProjectID(projectID)))
  }
  return getState().tasks
}