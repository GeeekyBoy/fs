import awsconfig from "../aws-exports";
import * as SRP from "./srp/low-level/index";
import calculateClaimSig from "./srp/franken-srp/calculateClaimSig";
import { bigIntToHex } from "./util/converters";
import * as cookies from "../controllers/cookies";
import decodeJwt from "../utils/decodeJwt";

class AuthManager {
  constructor() {
    this.clientId = awsconfig.aws_user_pools_web_client_id;
    this.groupId = awsconfig.aws_user_pools_id.split("_")[1];
    this.cognitoEndpoint = `https://cognito-idp.${awsconfig.aws_cognito_region}.amazonaws.com/`;
    this.accessToken = cookies.getCookie("accessToken");
    this.idToken = cookies.getCookie("idToken");
    this.refreshToken = cookies.getCookie("refreshToken");
    if (this.idToken) {
      const decodedIdToken = decodeJwt(this.idToken);
      this.expiresAt = decodedIdToken.exp * 1000;
      this.user = {
        username: decodedIdToken["cognito:username"],
        given_name: decodedIdToken.given_name,
        family_name: decodedIdToken.family_name,
        email: decodedIdToken.email,
      };
    } else {
      this.expiresAt = null;
      this.user = null;
    }
  }
  updateData(accessToken, idToken, refreshToken) {
    this.accessToken = accessToken;
    this.idToken = idToken;
    this.refreshToken = refreshToken;
    const decodedIdToken = decodeJwt(this.idToken);
    this.expiresAt = decodedIdToken.exp * 1000;
    this.user = {
      username: decodedIdToken["cognito:username"],
      given_name: decodedIdToken.given_name,
      family_name: decodedIdToken.family_name,
      email: decodedIdToken.email,
    };
    cookies.setCookie("accessToken", this.accessToken);
    cookies.setCookie("idToken", this.idToken, this.expiresAt);
    cookies.setCookie(
      "refreshToken",
      this.refreshToken,
      decodedIdToken.iat * 1000 + 3600 * 24 * 30
    );
  }
  resetData() {
    this.accessToken = null;
    this.idToken = null;
    this.refreshToken = null;
    this.expiresAt = null;
    this.user = null;
    cookies.removeCookie("accessToken");
    cookies.removeCookie("idToken");
    cookies.removeCookie("refreshToken");
  }
  getUser() {
    if (this.idToken) {
      return this.user;
    } else {
      throw new Error("User is not logged in");
    }
  }
  isLoggedIn() {
    return this.refreshToken !== null;
  }
  async getIdToken() {
    if (this.refreshToken) {
      if (this.expiresAt <= Date.now()) {
        await this.refresh();
      }
      return this.idToken;
    } else {
      throw new Error("User is not logged in");
    }
  }
  async signIn(username, password) {
    const a = await SRP.aCreate();
    const A = await SRP.A({ a });
    const SRP_A = bigIntToHex(A);
    const rawSrpAuthRes = await fetch(this.cognitoEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
        "X-Amz-User-Agent": "amazon",
      },
      body: JSON.stringify({
        AuthFlow: "USER_SRP_AUTH",
        ClientId: this.clientId,
        AuthParameters: {
          USERNAME: username,
          SRP_A,
        },
        ClientMetadata: {},
      }),
    });
    const srpAuthRes = await rawSrpAuthRes.json();
    console.log(srpAuthRes);
    const { claimSig, timestamp } = await calculateClaimSig(
      a,
      this.groupId,
      username,
      password,
      srpAuthRes.ChallengeParameters
    );
    const rawPasswordVerifierRes = await fetch(this.cognitoEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target":
          "AWSCognitoIdentityProviderService.RespondToAuthChallenge",
        "X-Amz-User-Agent": "amazon",
      },
      body: JSON.stringify({
        ChallengeName: "PASSWORD_VERIFIER",
        ClientId: this.clientId,
        ChallengeResponses: {
          USERNAME: srpAuthRes.ChallengeParameters.USER_ID_FOR_SRP,
          TIMESTAMP: timestamp,
          PASSWORD_CLAIM_SECRET_BLOCK:
            srpAuthRes.ChallengeParameters.SECRET_BLOCK,
          PASSWORD_CLAIM_SIGNATURE: claimSig,
        },
      }),
    });
    const passwordVerifierRes = await rawPasswordVerifierRes.json();
    if (passwordVerifierRes.status === 400) {
      throw {
        code: passwordVerifierRes.__type,
        message: passwordVerifierRes.message,
      };
    } else {
      const accessToken = passwordVerifierRes.AuthenticationResult.AccessToken;
      const idToken = passwordVerifierRes.AuthenticationResult.IdToken;
      const refreshToken = passwordVerifierRes.AuthenticationResult.RefreshToken;
      this.updateData(accessToken, idToken, refreshToken);
      console.log(passwordVerifierRes);
    }
  }
  async forgotPassword(username) {
    const rawForgotPasswordRes = await fetch(this.cognitoEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.ForgotPassword",
        "X-Amz-User-Agent": "amazon",
      },
      body: JSON.stringify({
        ClientId: this.clientId,
        Username: username,
      }),
    });
    const forgotPasswordRes = await rawForgotPasswordRes.json();
    console.log(forgotPasswordRes);
    if (forgotPasswordRes.status === 400) {
      throw {
        code: forgotPasswordRes.__type,
        message: forgotPasswordRes.message,
      };
    } else {
      return forgotPasswordRes;
    }
  }
  async forgotPasswordSubmit(username, code, newPassword) {
    const rawForgotPasswordSubmitRes = await fetch(this.cognitoEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target":
          "AWSCognitoIdentityProviderService.ConfirmForgotPassword",
        "X-Amz-User-Agent": "amazon",
      },
      body: JSON.stringify({
        ClientId: this.clientId,
        Username: username,
        ConfirmationCode: code,
        Password: newPassword,
      }),
    });
    const forgotPasswordSubmitRes = await rawForgotPasswordSubmitRes.json();
    console.log(forgotPasswordSubmitRes);
    if (forgotPasswordSubmitRes.status === 400) {
      throw {
        code: forgotPasswordSubmitRes.__type,
        message: forgotPasswordSubmitRes.message,
      };
    } else {
      return forgotPasswordSubmitRes;
    }
  }
  async signUp(username, password, attributes) {
    let attributeList = [];
    for (let key in attributes) {
      attributeList.push({
        Name: key,
        Value: attributes[key],
      });
    }
    const rawSignUpRes = await fetch(this.cognitoEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.SignUp",
        "X-Amz-User-Agent": "amazon",
      },
      body: JSON.stringify({
        ClientId: this.clientId,
        Username: username,
        Password: password,
        UserAttributes: attributeList,
      }),
    });
    const signUpRes = await rawSignUpRes.json();
    console.log(signUpRes);
    if (signUpRes.status === 400) {
      throw {
        code: signUpRes.__type,
        message: signUpRes.message,
      };
    } else {
      return signUpRes;
    }
  }
  async confirmSignUp(username, code) {
    const rawConfirmSignUpRes = await fetch(this.cognitoEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.ConfirmSignUp",
        "X-Amz-User-Agent": "amazon",
      },
      body: JSON.stringify({
        ClientId: this.clientId,
        Username: username,
        ConfirmationCode: code,
      }),
    });
    const confirmSignUpRes = await rawConfirmSignUpRes.json();
    console.log(confirmSignUpRes);
    if (confirmSignUpRes.status === 400) {
      throw {
        code: confirmSignUpRes.__type,
        message: confirmSignUpRes.message,
      };
    } else {
      return confirmSignUpRes;
    }
  }
  async signOut() {
    const rawSignOutRes = await fetch(this.cognitoEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.RevokeToken",
        "X-Amz-User-Agent": "amazon",
      },
      body: JSON.stringify({
        Token: this.accessToken,
        ClientId: this.clientId,
      }),
    });
    const signOutRes = await rawSignOutRes.json();
    console.log(signOutRes);
    this.resetData();
    return signOutRes;
  }
  async refresh() {
    const rawRefreshTokenRes = await fetch(this.cognitoEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
        "X-Amz-User-Agent": "amazon",
      },
      body: JSON.stringify({
        AuthFlow: "REFRESH_TOKEN_AUTH",
        AuthParameters: {
          REFRESH_TOKEN: this.refreshToken,
        },
        ClientId: this.clientId,
      }),
    });
    const refreshTokenRes = await rawRefreshTokenRes.json();
    console.log(refreshTokenRes);
    if (refreshTokenRes.status === 400) {
      throw {
        code: refreshTokenRes.__type,
        message: refreshTokenRes.message,
      };
    } else {
      const accessToken = refreshTokenRes.AuthenticationResult.AccessToken;
      const idToken = refreshTokenRes.AuthenticationResult.IdToken;
      this.updateData(accessToken, idToken, this.refreshToken);
      return refreshTokenRes;
    }
  }
}

export default new AuthManager();
