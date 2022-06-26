import * as usersActions from "./users"

export const SET_SESSION = "SET_SESSION";
export const IS_JOINED = "IS_JOINED";
export const JOIN_PROEJCT = "JOIN_PROEJCT";
export const LEAVE_PROJECT = "LEAVE_PROJECT";
export const FOCUS_TASK = "FOCUS_TASK";
export const UNFOCUS_TASK = "UNFOCUS_TASK";
export const SET_TXT_CURSOR = "SET_TXT_CURSOR";
export const RESET_COLLAB_DATA = "RESET_COLLAB_DATA";

const setSession = (session) => ({
  type: SET_SESSION,
  session
});

const setIsJoined = (isJoined, projectViewers = []) => ({
  type: IS_JOINED,
  isJoined,
  projectViewers
});

const setJoinedProject = (projectId, username) => ({
  type: JOIN_PROEJCT,
  projectId,
  username
});

const setLeftProject = (projectId, username) => ({
  type: LEAVE_PROJECT,
  projectId,
  username
});

const setFocusedTask = (taskId, username) => ({
  type: FOCUS_TASK,
  taskId,
  username
});

const setUnfocusedTask = (taskId, username) => ({
  type: UNFOCUS_TASK,
  taskId,
  username
});

const setTxtCursor = (taskId, pos, username) => ({
  type: SET_TXT_CURSOR,
  taskId,
  pos,
  username
});

const resetCollabData = () => ({
  type: RESET_COLLAB_DATA
});

export const handleInitSession = () => async (dispatch, getState) => {
  const session = getState().collaboration.session;
  const isOffline = getState().app.isOffline;
  const user = getState().user;
  if (session?.readyState !== WebSocket.OPEN) {
    await (() => new Promise((resolve, reject) => {
      if (isOffline) resolve(new Error("Failed to fetch"));
      const nextSession = new WebSocket(`wss://18gbulyifd.execute-api.us-east-1.amazonaws.com/Prod`)
      nextSession.onopen = () => {
        console.log("Websocket opened")
        dispatch(setSession(nextSession))
        resolve(nextSession)
      }
      nextSession.onmessage = async (event) => {
        const { action, username, ...data } = JSON.parse(event.data)
        if (username) {
          await dispatch(usersActions.handleAddUsers([username]))
          switch (action) {
            case "JOIN_PROJECT":
              dispatch(setJoinedProject(data.projectId, username))
              break;
            case "LEAVE_PROJECT":
              if (username !== user.data.username) {
                dispatch(setLeftProject(data.projectId, username))
              }
              break;
            case "FOCUS_TASK":
              dispatch(setFocusedTask(data.taskId, username))
              break;
            case "UNFOCUS_TASK":
              dispatch(setUnfocusedTask(data.taskId, username))
              break;
            case "MOVE_TXT_CURSOR":
              dispatch(setTxtCursor(data.taskId, data.pos, username))
              break;
          }
        } else if (action.includes("ACK")) {
          const usernames = JSON.parse(data.usernames)
          await dispatch(usersActions.handleAddUsers(usernames))
          switch (action) {
            case "JOIN_PROJECT_ACK":
              console.log(setIsJoined(true, usernames))
              dispatch(setIsJoined(true, usernames))
              break;
          }
        }
        console.log("Websocket message", JSON.parse(event.data))
      }
      nextSession.onerror = (err) => {
        console.log("Websocket error")
        console.log(err)
        resolve(err)
      }
      nextSession.onclose = (event) => {
        console.log("Websocket closed")
        console.log(event)
      }
    }))();
  }
}

export const handleJoinProject = (projectId) => async (dispatch, getState) => {
  const userData = getState().user.data;
  await dispatch(usersActions.handleAddUsers([userData.username]))
  dispatch(resetCollabData())
  dispatch(setJoinedProject(projectId, userData.username))
  const session = getState().collaboration.session;
  if (session?.readyState === WebSocket.OPEN) {
    dispatch(setIsJoined(false))
    const dataToSend = {
      action: "joinproject",
      data: {
        projectId: projectId,
        jwt: userData.jwt
      }
    }
    session.send(JSON.stringify(dataToSend));
  }
}

export const handleSendAction = (data) => async (dispatch, getState) => {
  const session = getState().collaboration.session;
  const isJoined = getState().collaboration.isJoined;
  if (session?.readyState === WebSocket.OPEN && isJoined) {
    const dataToSend = {
      action: "sendmessage",
      data: data
    }
    session.send(JSON.stringify(dataToSend));
  }
}

export const handleCloseSession = () => async (dispatch, getState) => {
  const session = getState().collaboration.session;
  if (session?.readyState === WebSocket.OPEN) {
    dispatch(setSession(null))
    dispatch(setIsJoined(false))
    await session.close();
  }
}
