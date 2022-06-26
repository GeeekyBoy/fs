import { SET_SESSION, JOIN_PROEJCT, LEAVE_PROJECT, FOCUS_TASK, UNFOCUS_TASK, SET_TXT_CURSOR, RESET_COLLAB_DATA, IS_JOINED } from "../actions/collaboration"

const initState = {
  session: null,
  isJoined: false,
  projectViewers: [],
  taskViewers: {}
}

export default function (state = initState, action) {
  switch(action.type) {
    case SET_SESSION:
      return {...state, session: action.session}
    case IS_JOINED:
      return {...state, isJoined: action.isJoined, projectViewers: action.projectViewers, taskViewers: {}}
    case JOIN_PROEJCT:
      return {...state, projectViewers: [...new Set([ action.username, ...state.projectViewers ])]}
    case LEAVE_PROJECT:
      state.projectViewers.splice(state.projectViewers.indexOf(action.username), 1)
      for (const taskId in state.taskViewers) {
        if (state.taskViewers[taskId].includes(action.username)) {
          state.taskViewers[taskId] = state.taskViewers[taskId].filter(user => user !== action.username)
        }
        if (state.taskViewers[taskId]?.length === 0) {
          delete state.taskViewers[taskId]
        }
      }
      return {...state}
    case FOCUS_TASK:
      for (const taskId in state.taskViewers) {
        if (state.taskViewers[taskId].includes(action.username)) {
          state.taskViewers[taskId].splice(state.taskViewers[taskId].indexOf(action.username), 1)
          if (state.taskViewers[taskId]?.length === 0) {
            delete state.taskViewers[taskId]
          }
        }
      }
      return {
        ...state,
        taskViewers: {
          ...state.taskViewers,
          [action.taskId]: [...new Set([ ...(state.taskViewers[action.taskId] || []), action.username])]
        }
      }
    case UNFOCUS_TASK:
      state.taskViewers[action.taskId]?.splice(state.taskViewers[action.taskId].indexOf(action.username), 1)
      if (state.taskViewers[action.taskId]?.length === 0) {
        delete state.taskViewers[action.taskId]
      }
      return {...state}
    case SET_TXT_CURSOR:
      return {...state}
    case RESET_COLLAB_DATA:
      return {
        ...state,
        projectViewers: [],
        taskViewers: {}
      }
    default:
      return state
  }
}