import { graphqlOperation } from "@aws-amplify/api";
import { AuthState } from '../constants';
import { listTasksForProject } from "../graphql/queries"
import * as appActions from "./app"
import * as statusActions from "./status"
import * as projectsActions from "./projects"
import * as usersActions from "./users"
import * as mutationsActions from "./mutations"
import * as mutations from "../graphql/mutations"
import * as cacheController from "../controllers/cache"
import { CREATING, REMOVING, READY, LOADING } from "../constants";
import prepareTaskToBeSent from "../utils/prepareTaskToBeSent";
import generateMutationID from "../utils/generateMutationID";
import execGraphQL from "../utils/execGraphQL";

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
  const { user } = getState()
  if (user.state === AuthState.SignedIn) {
    dispatch(statusActions.setTasksStatus(CREATING))
    const dataToSend = prepareTaskToBeSent(taskState)
    return execGraphQL(graphqlOperation(mutations.createTask, { input: dataToSend }))
      .then((incoming) => {
        if (taskState.projectID === getState().app.selectedProject) {
          dispatch(createTask(incoming.data.createTask))
          if (taskState.projectID === getState().app.selectedProject) {
            dispatch(appActions.handleSetTask(null))
          }
          dispatch(appActions.handleSetTask(incoming.data.createTask.id))
        }
        dispatch(statusActions.setTasksStatus(READY))
      })
      .catch(() => {
        dispatch(statusActions.setTasksStatus(READY))
      })
  } else {
    if (taskState.projectID === getState().app.selectedProject) {
      dispatch(createTask(taskState))
      dispatch(projectsActions.handleUpdateTaskCount(taskState.projectID, null, taskState.status))
      if (taskState.projectID === getState().app.selectedProject) {
        dispatch(appActions.handleSetTask(null))
      }
      dispatch(appActions.handleSetTask(taskState.id))
    }
  }
}

export const handleUpdateTask = (update) => (dispatch, getState) => {
  const { user, tasks, app } = getState()
  const prevTaskState = {...tasks[update.id]}
  const prevCommands = app.commands
  if (update.task) {
    const tREADYens = /^(.*?)(\/.*||)$/m.exec(update.task)
    update.task = tREADYens[1];
    dispatch(appActions.setCommand(tREADYens[2]))
  }
  const updateWithID = {id: prevTaskState.id, ...update };
  if (user.state === AuthState.SignedIn) {
    const mutationID = generateMutationID(user.data.username)
    dispatch(mutationsActions.addMutation(mutationID))
    if (tasks[prevTaskState.id]) {
      dispatch(updateTask(updateWithID))
    }
    return execGraphQL(graphqlOperation(mutations.updateTask, { input: { ...updateWithID, mutationID } }))
      .catch(() => {
        if (tasks[prevTaskState.id]) {
          dispatch(appActions.setCommand(prevCommands))
          return dispatch(updateTask(prevTaskState))
        }
      })
  } else {
    if (tasks[prevTaskState.id]) {
      dispatch(updateTask(updateWithID));
      if (update.status && prevTaskState.status !== update.status) {
        dispatch(projectsActions.handleUpdateTaskCount(prevTaskState.projectID, prevTaskState.status, update.status))
      }
    }
  }
}

export const handleRemoveTask = (taskState) => (dispatch, getState) => {
  const { user, tasks, app } = getState()
  if (app.selectedTask === taskState.id) {
    dispatch(appActions.handleSetTask(null))
  }
  if (user.state === AuthState.SignedIn) {
    dispatch(statusActions.setTasksStatus(REMOVING))
    return execGraphQL(graphqlOperation(mutations.deleteTaskAndComments, { taskId: taskState.id }))
      .then(() => {
        dispatch(statusActions.setTasksStatus(READY))
      })
      .catch(() => {
        dispatch(statusActions.setTasksStatus(READY))
      })
  } else {
    if (tasks[taskState.id]) {
      dispatch(removeTask(taskState.id))
      dispatch(projectsActions.handleUpdateTaskCount(taskState.projectID, taskState.status, null))
    }
  }
}

export const handleAssignTask = (taskID, username) => async (dispatch, getState) => {
  const {
    tasks,
    user
  } = getState()
  const prevAssignees = [...tasks[taskID].assignees]
  if (user.state === AuthState.SignedIn) {
    try {
      if (/^user:.*$/.test(username)) {
        await dispatch(usersActions.handleAddUsers([username.replace(/^user:/, "")]))
      }
      dispatch(updateTask({
        id: taskID,
        assignees: [...new Set([...prevAssignees, username])]
      }))
      const mutationID = generateMutationID(user.data.username)
      dispatch(mutationsActions.addMutation(mutationID))
      await execGraphQL(graphqlOperation(mutations.assignTask, {
        taskID: taskID,
        assignee: username,
        mutationID: mutationID
      }))
    } catch {
      dispatch(updateTask({
        id: taskID,
        assignees: prevAssignees
      }))
    }
  } else if (/^anonymous:.*$/.test(username)) {
    dispatch(updateTask({
      id: taskID,
      assignees: [...new Set([...prevAssignees, username])]
    }))
  }
}

export const handleAddWatcher = (taskID, username) => async (dispatch, getState) => {
  const {
    tasks,
    user
  } = getState()
  if (user.state === AuthState.SignedIn) {
    const prevWatchers = [...tasks[taskID].watchers]
    dispatch(updateTask({
      id: taskID,
      watchers: [...new Set([...prevWatchers, username])]
    }))
    try {
      await dispatch(usersActions.handleAddUsers([username]))
      const mutationID = generateMutationID(user.data.username)
      dispatch(mutationsActions.addMutation(mutationID))
      await execGraphQL(graphqlOperation(mutations.addWatcher, {
        taskID: taskID,
        watcher: username,
        mutationID: mutationID
      }))
    } catch {
      dispatch(updateTask({
        id: taskID,
        watchers: prevWatchers
      }))
    }
  }
}

export const handleUnassignTask = (taskID, username) => async (dispatch, getState) => {
  const {
    tasks,
    user
  } = getState()
  const prevAssignees = [...tasks[taskID].assignees]
  dispatch(updateTask({
    id: taskID,
    assignees: [...prevAssignees].filter(x => x !== username)
  }))
  if (user.state === AuthState.SignedIn) {
    try {
      const mutationID = generateMutationID(user.data.username)
      dispatch(mutationsActions.addMutation(mutationID))
      await execGraphQL(graphqlOperation(mutations.unassignTask, {
        taskID: taskID,
        assignee: username,
        mutationID: mutationID
      }))
    } catch {
      dispatch(updateTask({
        id: taskID,
        assignees: prevAssignees
      }))
    }
  }
}

export const handleRemoveWatcher = (taskID, username) => async (dispatch, getState) => {
  const {
    tasks,
    user
  } = getState()
  if (user.state === AuthState.SignedIn) {
    const prevWatchers = [...tasks[taskID].watchers]
    dispatch(updateTask({
      id: taskID,
      watchers: [...prevWatchers].filter(x => x !== username)
    }))
    try {
      const mutationID = generateMutationID(user.data.username)
      dispatch(mutationsActions.addMutation(mutationID))
      await execGraphQL(graphqlOperation(mutations.removeWatcher, {
        taskID: taskID,
        watcher: username,
        mutationID: mutationID
      }))
    } catch {
      dispatch(updateTask({
        id: taskID,
        watchers: prevWatchers
      }))
    }
  }
}

export const handleFetchTasks = (projectID, isInitial = false) => async (dispatch, getState) => {
  const { user } = getState()
  if (!isInitial) {
    dispatch(appActions.handleSetTask(null))
  }
  if (user.state === AuthState.SignedIn) {
    try {
      dispatch(statusActions.setTasksStatus(LOADING))
      const res = await execGraphQL(graphqlOperation(listTasksForProject, { projectID }))
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