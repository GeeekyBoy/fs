import * as projectsActions from "./projects"
import * as tasksActions from "./tasks"
import * as commentsActions from "./comments"
import * as notificationsActions from "./notifications"
import * as appActions from "./app"
import * as userActions from "./user"
import * as usersActions from "./users"
import * as subscriptions from "../graphql/subscriptions"
import * as mutationID from "../utils/mutationID"
import filterObj from "../utils/filterObj";
import updateAssignedTasks from "../pushedUpdates/updateAssignedTasks";
import updateWatchedTasks from "../pushedUpdates/updateWatchedTasks";
import generateID from "../utils/generateID";
import { navigate } from "../components/Router"
import PubSub from "../amplify/PubSub"

export const SET_USER_OBSERVERS = "SET_USER_OBSERVERS";
export const CLEAR_USER_OBSERVERS = "CLEAR_USER_OBSERVERS";
export const SET_OWNED_PROJECTS_OBSERVERS = "SET_OWNED_PROJECTS_OBSERVERS";
export const CLEAR_OWNED_PROJECTS_OBSERVERS = "CLEAR_OWNED_PROJECTS_OBSERVERS";
export const SET_PROJECT_OBSERVERS = "SET_PROJECT_OBSERVERS";
export const CLEAR_PROJECT_OBSERVERS = "CLEAR_PROJECT_OBSERVERS";
export const SET_TASKS_OBSERVERS = "SET_TASKS_OBSERVERS";
export const CLEAR_TASKS_OBSERVERS = "CLEAR_TASKS_OBSERVERS";
export const SET_COMMENTS_OBSERVERS = "SET_COMMENTS_OBSERVERS";
export const CLEAR_COMMENTS_OBSERVERS = "CLEAR_COMMENTS_OBSERVERS";
export const SET_NOTIFICATIONS_OBSERVERS = "SET_NOTIFICATIONS_OBSERVERS";
export const CLEAR_NOTIFICATIONS_OBSERVERS = "CLEAR_NOTIFICATIONS_OBSERVERS";

export const handleSetNotificationsObservers = () => async (dispatch, getState) => {
  const { user, app: { isOffline } } = getState()
  if (!isOffline) {
    const data = {
      owner: user.data.username
    }
    await PubSub.subscribe({
      id: generateID(),
      query: subscriptions.onPushNotification,
      variables: data,
      topic: "notifications",
      next: async e => {
        const { notifications } = getState()
        const incoming = e.value.data.onPushNotification
        if (!notifications.stored.filter(x => x.id === incoming.id).length) {
          await dispatch(usersActions.handleAddUsers([incoming.sender]))
          dispatch(notificationsActions.add(incoming))
          dispatch(notificationsActions.push(incoming))
        }
      },
      error: error => console.warn(error)
    })
    await PubSub.subscribe({
      id: generateID(),
      query: subscriptions.onDismissNotification,
      variables: data,
      topic: "notifications",
      next: e => {
        const { notifications } = getState()
        const incoming = e.value.data.onDismissNotification
        if (notifications.stored.filter(x => x.id === incoming.id).length) {
          dispatch(notificationsActions.dismiss(incoming.id))
          dispatch(notificationsActions.remove(incoming.id))
        }
      },
      error: error => console.warn(error)
    })
  }
}

export const handleClearNotificationsObservers = () => () => {
  PubSub.unsubscribe("notifications")
}

export const handleSetUserObservers = () => async (dispatch, getState) => {
  const { user, app: { isOffline } } = getState()
  if (!isOffline) {
    const data = {
      username: user.data.username
    }
    await PubSub.subscribe({
      id: generateID(),
      query: subscriptions.onPushUserUpdate,
      variables: data,
      topic: "user",
      next: e => {
        const incoming = e.value.data.onPushUserUpdate
        dispatch(userActions.handleSetData(incoming))
        updateAssignedTasks(dispatch, getState, incoming)
        updateWatchedTasks(dispatch, getState, incoming)
      },
      error: error => console.warn(error)
    })
  }
}

export const handleClearUserObservers = () => (dispatch, getState) => {
  PubSub.unsubscribe("user")
}

export const handleSetOwnedProjectsObservers = () => async (dispatch, getState) => {
  const { user, app: { isOffline } } = getState()
  if (!isOffline) {
    const data = {
      owner: user.data.username
    }
    await PubSub.subscribe({
      id: generateID(),
      query: subscriptions.onCreateOwnedProject,
      variables: data,
      topic: "ownedProjects",
      next: e => {
        const { projects } = getState()
        const ownedProjects = filterObj(projects, x => x.isOwned)
        const incoming = e.value.data.onCreateOwnedProject
        if (!mutationID.isLocal(incoming.mutationID)) {
          if (!Object.keys(ownedProjects).includes(incoming.id)) {
            dispatch(projectsActions.createProject(incoming, "owned"))
          }
        }
      },
      error: error => console.warn(error)
    })
    await PubSub.subscribe({
      id: generateID(),
      query: subscriptions.onImportOwnedProjects,
      variables: data,
      topic: "ownedProjects",
      next: e => {
        const { projects } = getState()
        const ownedProjects = filterObj(projects, x => x.isOwned)
        const incoming = e.value.data.onImportOwnedProjects.items
        for (const project of incoming) {
          if (!Object.keys(ownedProjects).includes(project.id)) {
            dispatch(projectsActions.createProject(project))
          }
        }
      },
      error: error => console.warn(error)
    })
    await PubSub.subscribe({
      id: generateID(),
      query: subscriptions.onUpdateOwnedProject,
      variables: data,
      topic: "ownedProjects",
      next: e => {
        const { projects } = getState()
        const ownedProjects = filterObj(projects, x => x.isOwned)
        const incoming = e.value.data.onUpdateOwnedProject
        if (!mutationID.isLocal(incoming.mutationID)) {
          if (Object.keys(ownedProjects).includes(incoming.id)) {
            const lastMutationDate = projects[incoming.id].mutatedAt || null
            const mutationDate = new Date(incoming.updatedAt).getTime()
            if (!mutationDate || (mutationDate && lastMutationDate < mutationDate)) {
              dispatch(projectsActions.updateProject({
                ...incoming,
                mutatedAt: mutationDate
              }))
            }
          }
        }
      },
      error: error => console.warn(error)
    })
    await PubSub.subscribe({
      id: generateID(),
      query: subscriptions.onDeleteOwnedProject,
      variables: data,
      topic: "ownedProjects",
      next: e => {
        const { app, projects } = getState()
        const ownedProjects = filterObj(projects, x => x.isOwned)
        const incoming = e.value.data.onDeleteOwnedProject;
        if (!mutationID.isLocal(incoming.mutationID)) {
          if (Object.keys(ownedProjects).includes(incoming.id)) {
            if (app.selectedProject === incoming.id) {
              dispatch(appActions.handleSetTask(null))
            }
            dispatch(projectsActions.removeProject(incoming.id))
          }
        }
      },
      error: error => console.warn(error)
    })
  }
}

export const handleClearOwnedProjectsObservers = () => (dispatch, getState) => {
  PubSub.unsubscribe("ownedProjects")
}

export const handleSetProjectObservers = (projectID) => async (dispatch, getState) => {
  const { projects, observers, app: { isOffline } } = getState()
  if (!isOffline && !projects[projectID]?.isAssigned && !observers.projects.others[projectID]) {
    const data = { id: projectID }
    await PubSub.subscribe({
      id: generateID(),
      query: subscriptions.onPushUserUpdate,
      variables: data,
      topic: "proejct",
      next: e => {
        const { projects, app } = getState()
        const incoming = e.value.data.onUpdateProject
        if (projects[incoming.id]) {
          if (!mutationID.isLocal(incoming.mutationID)) {
            const lastMutationDate = projects[incoming.id].mutatedAt || null
            const mutationDate = new Date(incoming.updatedAt).getTime()
            if (!mutationDate || (mutationDate && lastMutationDate < mutationDate)) {
              const prevPermalink = projects[incoming.id].permalink
              dispatch(projectsActions.updateProject({
                ...incoming,
                mutatedAt: mutationDate
              }))
              if (app.selectedProject === incoming.id && incoming.permalink !== prevPermalink) {
                navigate("/" + incoming.permalink, { replace: true })
              }
            }
          }
        }
      },
      error: error => console.warn(error)
    })
    await PubSub.subscribe({
      id: generateID(),
      query: subscriptions.onDeleteProject,
      variables: data,
      topic: "project",
      next: e => {
        const { app, projects } = getState()
        const incoming = e.value.data.onDeleteProject;
        if (projects[incoming.id]) {
          if (!mutationID.isLocal(incoming.mutationID)) {
            dispatch(handleClearProjectObservers(incoming.id))
            if (app.selectedProject === incoming.id) {
              dispatch(appActions.handleSetTask(null))
            }
            dispatch(projectsActions.removeProject(incoming.id))
          }
        }
      },
      error: error => console.warn(error)
    })
  }
}

export const handleClearProjectObservers = (projectID) => () => {
  PubSub.unsubscribeAll("project")
}

export const handleSetTasksObservers = (projectID) => async (dispatch, getState) => {
  const { app: { selectedProject, isOffline } } = getState()
  if (!isOffline && selectedProject === projectID) {
    await PubSub.subscribe({
      id: generateID(),
      query: subscriptions.onCreateTaskByProjectId,
      variables: { projectID },
      topic: "tasks",
      next: async (e) => {
        const { tasks } = getState()
        const incoming = e.value.data.onCreateTaskByProjectID
        if (!mutationID.isLocal(incoming.mutationID)) {
          if (!Object.keys(tasks).includes(incoming.id)) {
            const usersToBeFetched = [...new Set([
              ...incoming.assignees.filter(x => /^user:.*$/.test(x)).map(x => x.replace(/^user:/, "")),
              ...incoming.watchers
            ])]
            await dispatch(usersActions.handleAddUsers(usersToBeFetched))
            dispatch(tasksActions.createTask(incoming))
          }
        }
      },
      error: error => console.warn(error)
    })
    await PubSub.subscribe({
      id: generateID(),
      query: subscriptions.onUpdateTaskByProjectId,
      variables: { projectID },
      topic: "tasks",
      next: async (e) => {
        const { tasks } = getState()
        const incoming = e.value.data.onUpdateTaskByProjectID
        if (!mutationID.isLocal(incoming.mutationID)) {
          if (Object.keys(tasks).includes(incoming.id)) {
            const lastMutationDate = tasks[incoming.id].mutatedAt || null
            const mutationDate = new Date(incoming.updatedAt).getTime()
            if (!mutationDate || (mutationDate && lastMutationDate < mutationDate)) {
              const usersToBeFetched = [...new Set([
                ...(incoming.assignees?.filter(x => /^user:.*$/.test(x))?.map(x => x.replace(/^user:/, "")) || []),
                ...(incoming.watchers || [])
              ])]
              await dispatch(usersActions.handleAddUsers(usersToBeFetched))
              dispatch(tasksActions.updateTask({
                ...incoming,
                mutatedAt: mutationDate
              }))
            }
          }
        }
      },
      error: error => console.warn(error)
    })
    await PubSub.subscribe({
      id: generateID(),
      query: subscriptions.onDeleteTaskByProjectId,
      variables: { projectID },
      topic: "tasks",
      next: e => {
        const { tasks, app } = getState()
        const incoming = e.value.data.onDeleteTaskByProjectID;
        if (!mutationID.isLocal(incoming.mutationID)) {
          if (Object.keys(tasks).includes(incoming.id)) {
            if (app.selectedTask === incoming.id) {
              dispatch(appActions.handleSetTask(null))
            }
            dispatch(tasksActions.removeTask(incoming.id))
          }
        }
      },
      error: error => console.warn(error)
    })
  }
}

export const handleClearTasksObservers = () => (dispatch, getState) => {
  PubSub.unsubscribe("tasks")
}

export const handleSetCommentsObservers = (taskID) => async (dispatch, getState) => {
  const { app: { selectedTask, isOffline } } = getState()
    if (!isOffline && selectedTask === taskID) {
    await PubSub.subscribe({
      id: generateID(),
      query: subscriptions.onCreateCommentByTaskId,
      variables: { taskID },
      topic: "comments",
      next: async (e) => {
        const { comments } = getState()
        const incoming = e.value.data.onCreateCommentByTaskID
        if (!mutationID.isLocal(incoming.mutationID)) {
          if (!Object.keys(comments).includes(incoming.id)) {
            await dispatch(usersActions.handleAddUsers([incoming.owner]))
            dispatch(commentsActions.createComment(incoming))
          }
        }
      },
      error: error => console.warn(error)
    })
    await PubSub.subscribe({
      id: generateID(),
      query: subscriptions.onUpdateCommentByTaskId,
      variables: { taskID },
      topic: "comments",
      next: e => {
        const { comments } = getState()
        const incoming = e.value.data.onUpdateCommentByTaskID
        if (!mutationID.isLocal(incoming.mutationID)) {
          if (Object.keys(comments).includes(incoming.id)) {
            const lastMutationDate = comments[incoming.id].mutatedAt || null
            const mutationDate = new Date(incoming.updatedAt).getTime()
            if (!mutationDate || (mutationDate && lastMutationDate < mutationDate)) {
              dispatch(commentsActions.updateComment({
                ...incoming,
                mutatedAt: mutationDate
              }))
            }
          }
        }
      },
      error: error => console.warn(error)
    })
    await PubSub.subscribe({
      id: generateID(),
      query: subscriptions.onDeleteCommentByTaskId,
      variables: { taskID },
      topic: "comments",
      next: e => {
        const { comments } = getState()
        const incoming = e.value.data.onDeleteCommentByTaskID;
        if (!mutationID.isLocal(incoming.mutationID)) {
          if (Object.keys(comments).includes(incoming.id)) {
            dispatch(commentsActions.removeComment(incoming.id))
          }
        }
      },
      error: error => console.warn(error)
    })
  }
}

export const handleClearCommentsObservers = () => () => {
  PubSub.unsubscribe("comments")
}