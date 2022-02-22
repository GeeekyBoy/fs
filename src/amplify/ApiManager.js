import awsconfig from "../aws-exports";
import AuthManager from "./AuthManager";
import generateID from "../utils/generateID";

class ApiManager {
  constructor() {
    this.subscriptions = {};
    this.apiEndpoint = awsconfig.aws_appsync_graphqlEndpoint;
    this.wsEndpoint = this.apiEndpoint
      .replace("https://", "wss://")
      .replace("-api", "-realtime-api");
    this.wsHost = new URL(this.apiEndpoint).host;
    const wsHeader = window.btoa(
      JSON.stringify({
        Authorization: AuthManager.idToken,
        host: this.wsHost,
      })
    );
    this.ws = new WebSocket(
      `${this.wsEndpoint}?header=${wsHeader}&payload=e30=`,
      "graphql-ws"
    );
    this.ws.onopen = () => {
      console.log("WebSocket connected");
    };
    this.ws.onmessage = (event) => {
      console.log("WebSocket message", event.data);
      const data = JSON.parse(event.data);
      if (data.id) {
        const { id, type } = data;
        switch (type) {
          case "data":
            const { payload } = data;
            this.subscriptions[id].next({
              value: payload,
            });
            break;
          case "complete":
            delete this.subscriptions[id];
            break;
          default:
            break;
        }
      }
    };
    this.ws.onclose = () => {
      console.log("WebSocket closed");
    };
    this.ws.onerror = (event) => {
      console.log("WebSocket error", event);
    };
  }
  async subscribe(query, variables, callback) {
    const subscriptionId = generateID();
    const dataToSend = {
      id: subscriptionId,
      payload: {
        data: JSON.stringify({ query, variables }),
        extensions: {
          authorization: {
            Authorization: await AuthManager.getIdToken(),
            host: this.wsHost,
            "x-amz-user-agent": "aws-amplify/4.3.13 js",
          },
        },
      },
      type: "start",
    };
    this.ws.send(JSON.stringify(dataToSend));
    this.subscriptions[subscriptionId] = callback;
    return {
      id: subscriptionId,
      ws: this.ws,
      active: false,
      unsubscribe() {
        this.ws.send(JSON.stringify({ id: this.id, type: "stop" }));
      },
    };
  }
  async execute(query, variables) {
    const rawRes = await fetch(this.apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: await AuthManager.getIdToken(),
      },
      body: JSON.stringify({ query, variables }),
    });
    const res = await rawRes.json();
    return res;
  }
}

export default new ApiManager();
