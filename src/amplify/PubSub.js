import awsconfig from "../aws-exports";
import Auth from "./Auth";
import signAwsReq from "./signAwsReq";

class PubSub {
  constructor() {
    this.subscriptions = {};
    this.reqQueue = [];
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
  async sendNextReq() {
    if (!this.ws || this.ws.readyState > 1) {
      await this.initialize();
    }
    if (this.reqQueue.length) {
      const subscriptionId = this.reqQueue[0][0];
      if (this.reqQueue[0][1] === 1) {
        const subscription = this.subscriptions[subscriptionId];
        const body = JSON.stringify({
          query: subscription.query,
          variables: subscription.variables,
        });
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
      } else if (this.reqQueue[0][1] === 0) {
        const dataToSend = {
          id: subscriptionId,
          type: "stop",
        };
        this.ws.send(JSON.stringify(dataToSend));
      }
    }
  }
  onMessage(event) {
    const data = JSON.parse(event.data);
    console.log(data)
    if (data.id) {
      const { id, type } = data;
      switch (type) {
        case "data":
          if (this.subscriptions[id].startAck) {
            this.subscriptions[id].next({
              value: data.payload,
            });
          }
          break;
        case "start_ack":
          this.subscriptions[id].startAck = true;
          if (this.reqQueue[0]?.[0] === id) {
            this.reqQueue.shift();
            this.sendNextReq();
          }
          break;
        case "complete":
          delete this.subscriptions[id];
          if (this.reqQueue[0]?.[0] === id) {
            this.reqQueue.shift();
            this.sendNextReq();
          }
          break;
        default:
          break;
      }
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
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onclose = () => (this.ws = null);
        this.ws.onerror = (event) => {
          console.error("WebSocket error", event);
          reject(event);
        };
      })();
    });
  }
  async subscribe(template) {
    this.subscriptions[template.id] = {
      query: template.query,
      variables: template.variables,
      topic: template.topic,
      next: template.next,
      error: template.error,
      startAck: false,
    };
    this.reqQueue.push([template.id, 1]);
    if (this.reqQueue.length === 1) {
      this.sendNextReq();
    }
  }
  unsubscribe(topic) {
    for (const subscriptionId in this.subscriptions) {
      if (this.subscriptions[subscriptionId].topic === topic) {
        this.subscriptions[subscriptionId].startAck = false;
        this.reqQueue.push([subscriptionId, 0]);
        if (this.reqQueue.length === 1) {
          this.sendNextReq();
        }
      }
    }
  }
}

export default new PubSub();
