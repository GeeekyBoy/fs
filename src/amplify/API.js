import awsconfig from "../aws-exports";
import Auth from "./Auth";
import signAwsReq from "./signAwsReq";

class API {
  constructor() {
    this.apiEndpoint = awsconfig.aws_appsync_graphqlEndpoint;
    this.region = awsconfig.aws_appsync_region;
  }
  async execute(query, variables) {
    const body = JSON.stringify({ query, variables });
    const headers = (await Auth.isLoggedIn())
      ? {
          "Content-Type": "application/json",
          Authorization: await Auth.getIdToken(),
        }
      : await signAwsReq(
          "POST",
          "appsync",
          this.apiEndpoint,
          this.region,
          Auth.accessToken,
          Auth.secretKey,
          Auth.sessionToken,
          body
        );
    const rawRes = await fetch(this.apiEndpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ query, variables }),
    });
    const res = await rawRes.json();
    return res;
  }
}

export default new API();
