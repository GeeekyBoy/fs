import { AuthState } from "../constants";
import PubSub from "../amplify/PubSub";

export default async (query, variables = {}, callback) => {
  return PubSub.subscribe(query, variables, callback);
};
