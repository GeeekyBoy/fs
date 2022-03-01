import { AuthState } from '../constants';
import getGravatar from '../utils/getGravatar';
import * as observersActions from "./observers"
import * as queries from "../graphql/queries"
import * as cacheController from "../controllers/cache"
import * as notificationsActions from "./notifications"
import Auth from '../amplify/Auth';
import API from '../amplify/API';

export const SET_STATE = "SET_STATE";
export const SET_DATA = "SET_DATA";
export const FETCH_CACHED_USER = "FETCH_CACHED_USER";

const setState = (userSate) => ({
  type: SET_STATE,
  userSate
});

const setData = (userData) => ({
  type: SET_DATA,
  userData
});

const fetchCachedUser = (user) => ({
  type: FETCH_CACHED_USER,
  user
});

export const handleSetState = (userState) => (dispatch) => {
  if (userState !== AuthState.SignedIn) {
    dispatch(observersActions.handleClearUserObservers())
  }
  dispatch(setState(userState))
  if (userState === AuthState.SignedIn) {
    dispatch(observersActions.handleSetUserObservers())
    dispatch(notificationsActions.handleFetchNotifications())
    dispatch(observersActions.handleSetNotificationsObservers())
  }
}

export const handleSetData = (userData) => (dispatch, getState) => {
  if (userData) {
    const { firstName, lastName } = userData
    const abbr = firstName[0].toUpperCase() + lastName[0].toUpperCase()
    dispatch(setData({...userData, abbr}))
    if (!userData.avatar) {
      getGravatar(userData.email).then((avatar) => {
        dispatch(setData({...getState().user.data, avatar}))
      })
    }
  } else {
    dispatch(setData(null))
  }
}

export const handleFetchUser = () => async (dispatch, getState) => {
  if (await Auth.isLoggedIn()/* || cacheController.getUser().state === AuthState.SignedIn*/) {
    try {
      const userData = (
        await API.execute(queries.getUserByUsername, {
          username: Auth.getUser().username,
        })
      ).data.getUserByUsername;
      userData.jwt = await Auth.getAccessToken();
      dispatch(handleSetData(userData))
      dispatch(handleSetState(AuthState.SignedIn))
    } catch (err) {
      console.error(err)
      if (err.errors?.[0]?.message === 'Network Error') {
        dispatch(fetchCachedUser(cacheController.getUser()))
      }
    }
  } else {
    dispatch(handleSetState(AuthState.SignedOut))
    dispatch(handleSetData(null))
  }
  return getState().user
}

export const handleSignOut = (shouldResetCache = false) => async (dispatch, getState) => {
  if (shouldResetCache) cacheController.resetCache();
  await Auth.signOut()
  dispatch(handleSetState(AuthState.SignedOut))
  dispatch(handleSetData(null))
  if (shouldResetCache) window.location.reload();
  return getState().user
}