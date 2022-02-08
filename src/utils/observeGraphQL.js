import store from "../store";
import { API } from "@aws-amplify/api";
import { AuthState } from "../constants";

export default async (options, callback) => {
  return await API.graphql({
    authMode:
      store.getState().user.state === AuthState.SignedIn ?
      "AMAZON_COGNITO_USER_POOLS" :
      "AWS_IAM",
    ...options
  }).subscribe(callback);
};
