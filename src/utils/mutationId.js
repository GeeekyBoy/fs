import { customAlphabet } from 'nanoid'
import store from "../store"
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid26 = customAlphabet(alphabet, 26);
const nanoid10 = customAlphabet(alphabet, 10);
export const sessionId = nanoid10();
export const generate = () => {
  const username = store.getState().user.data.username;
  return username + "-" + sessionId + "-" + nanoid26();
}
export const isLocal = (mutationId) => {
  return mutationId && mutationId.split("-")[1] === sessionId;
}
