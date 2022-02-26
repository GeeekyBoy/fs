import awsconfig from "../aws-exports";
import Auth from "./Auth";
import generateID from "../utils/generateID";
import signAwsReq from "./signAwsReq";

class PubSub {
  constructor() {
    this.subscriptions = {};
    this.apiEndpoint = awsconfig.aws_appsync_graphqlEndpoint;
    this.wsEndpoint = this.apiEndpoint
      .replace("https://", "wss://")
      .replace("-api", "-realtime-api");
    this.wsHost = new URL(this.apiEndpoint).host;
    this.region = awsconfig.aws_appsync_region;
    this.ws = null;
  }
  async authorize(payload = "{}", init = true) {
    if (await Auth.isLoggedIn()) {
      return {
        Authorization: await Auth.getIdToken(),
        host: this.wsHost,
      };
    } else {
      return await signAwsReq(
        "POST",
        "appsync",
        this.apiEndpoint + (init ? "/connect" : ""),
        this.region,
        Auth.accessToken,
        Auth.secretKey,
        Auth.sessionToken,
        payload,
        {
          accept: "application/json, text/javascript",
          "content-encoding": "amz-1.0",
        }
      );
    }
  }
  async initialize() {
    return new Promise((resolve, reject) => {
      (async () => {
        const parsedWsHeaders = window.btoa(
          JSON.stringify(await this.authorize())
        );
        this.ws = new WebSocket(
          `${this.wsEndpoint}?header=${parsedWsHeaders}&payload=e30=`,
          "graphql-ws"
        );
        this.ws.onopen = () => resolve();
        this.ws.onmessage = (event) => {
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
        this.ws.onclose = () => (this.ws = null);
        this.ws.onerror = (event) => {
          console.error("WebSocket error", event);
          reject(event);
        };
      })();
    });
  }
  async subscribe(query, variables, callback) {
    await this.initialize();
    const subscriptionId = generateID();
    const body = JSON.stringify({ query, variables });
    const dataToSend = {
      id: subscriptionId,
      payload: {
        data: body,
        extensions: {
          authorization: await this.authorize(body, false),
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
}

export default new PubSub();
