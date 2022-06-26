import { AuthState } from '../constants';
import { listAttachmentsByTaskId } from "../graphql/queries"
import * as usersActions from "./users"
import * as cacheController from "../controllers/cache"
import API from '../amplify/API';

export const CREATE_ATTACHMENT = "CREATE_ATTACHMENT";
export const EMPTY_ATTACHMENTS = "EMPTY_ATTACHMENTS";
export const FETCH_ATTACHMENTS = "FETCH_ATTACHMENTS";
export const FETCH_CACHED_ATTACHMENTS = "FETCH_CACHED_ATTACHMENTS";

export const createAttachment = (attachmentState) => ({
  type: CREATE_ATTACHMENT,
  attachmentState
});

export const emptyAttachments = () => ({
  type: EMPTY_ATTACHMENTS
});

const fetchAttachments = (attachments, taskId) => ({
  type: FETCH_ATTACHMENTS,
  attachments,
  taskId
});

const fetchCachedAttachments = (attachments) => ({
  type: FETCH_CACHED_ATTACHMENTS,
  attachments
});

export const handleFetchAttachments = (taskId) => async (dispatch, getState) => {
  const { user, app, projects } = getState()
  if (user.state === AuthState.SignedIn || projects[app.selectedProject].isTemp) {
    try {
      const res = await API.execute(listAttachmentsByTaskId, { taskId })
      const items = res.data.listAttachmentsByTaskId.items;
      dispatch(fetchAttachments(items, taskId))
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        dispatch(fetchCachedAttachments(cacheController.getAttachmentsByTaskId(taskId)))
      }
    }
    return getState().attachments
  }
}