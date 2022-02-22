import store from "../store";
import { AuthState } from "../constants";
import ApiManager from "../amplify/ApiManager";

export default async (query, variables = {}, callback) => {
  return ApiManager.subscribe(query, variables, callback);
};
