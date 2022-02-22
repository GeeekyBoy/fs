import store from "../store";
import * as appActions from "../actions/app";
import { AuthState } from "../constants";
import ApiManager from "../amplify/ApiManager";

export default (query, variables = {}) => {
  return new Promise((resolve, reject) => {
    if (!store.getState().app.isOffline) {
      ApiManager.execute(query, variables)
        .then(resolve)
        .catch((err) => {
          if (err.errors?.[0]?.message === "Network Error") {
            store.dispatch(appActions.setOffline(true));
          } else {
            console.error(err);
          }
          reject(err);
        });
    } else {
      reject({ errors: [{ message: "Network Error" }] });
    }
  });
};
