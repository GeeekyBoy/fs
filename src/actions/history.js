import { AuthState } from '../constants';
import { listHistoryByTaskId } from "../graphql/queries"
import * as usersActions from "./users"
import * as cacheController from "../controllers/cache"
import API from '../amplify/API';

export const CREATE_HISTORY = "CREATE_HISTORY";
export const EMPTY_HISTORY = "EMPTY_HISTORY";
export const FETCH_HISTORY = "FETCH_HISTORY";
export const FETCH_CACHED_HISTORY = "FETCH_CACHED_HISTORY";

export const createHistory = (historyState) => ({
  type: CREATE_HISTORY,
  historyState
});

export const emptyHistory = () => ({
  type: EMPTY_HISTORY
});

const fetchHistory = (history, taskId) => ({
  type: FETCH_HISTORY,
  history,
  taskId
});

const fetchCachedHistory = (history) => ({
  type: FETCH_CACHED_HISTORY,
  history
});

export const handleFetchHistory = (taskId) => async (dispatch, getState) => {
  const { user, app, projects } = getState()
  if (user.state === AuthState.SignedIn || projects[app.selectedProject].isTemp) {
    try {
      const res = await API.execute(listHistoryByTaskId, { taskId })
      const items = res.data.listHistoryByTaskId.items;
      let usersToBeFetched = []
      for (const item of items) {
        usersToBeFetched = [...new Set([
          ...usersToBeFetched,
          item.owner,
          ...(item.field === "assignees" || item.field === "watchers"
            ? item.value
            : []),
        ])]
      }
      await dispatch(usersActions.handleAddUsers(usersToBeFetched))
      dispatch(fetchHistory(items, taskId))
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        dispatch(fetchCachedHistory(cacheController.getHistoryByTaskId(taskId)))
      }
    }
    return getState().history
  }
}