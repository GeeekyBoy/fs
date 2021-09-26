import { IMPORT_APP_SETTINGS, SET_THEME, SET_TASKS_SORTING_CRITERIA } from "../actions/appSettings"

const initState = JSON.parse(window.localStorage.getItem("appSettings")) || {
  theme: "blue",
  tasksSortingCriteria: "BY_DEFAULT"
}

export default function (state = initState, action) {
  switch(action.type) {
    case SET_THEME:
      return {...state, theme: action.theme}
    case SET_TASKS_SORTING_CRITERIA:
      return {...state, tasksSortingCriteria: action.criteria}
    case IMPORT_APP_SETTINGS:
      return {...action.settings}
    default:
      return state
  }
}