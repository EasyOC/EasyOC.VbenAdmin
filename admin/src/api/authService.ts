/* eslint-disable */
import Oidc from 'oidc-client';
// import 'babel-polyfill';
import { useGlobSetting } from '@/hooks/setting';

const oidcClient = new Oidc.UserManager({

 userStore: new Oidc.WebStorageStateStore({ prefix: 'oidc_', store: localStorage }),
  authority: useGlobSetting().stsAuthority,
  client_id: useGlobSetting().clientId,
  redirect_uri: useGlobSetting().clientRoot + 'signin-callback',
  scope: useGlobSetting().scopes,
  post_logout_redirect_uri: useGlobSetting().clientRoot + 'signout-callback',
  filterProtocolClaims: true,
  loadUserInfo: true,
  response_type: useGlobSetting().responseType,
  client_secret: "123123/q",
  
})

Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.INFO;

oidcClient.events.addUserLoaded((user) => {
  console.log('New User Loaded：', user);
  console.log('Acess_token: ', user.access_token)
});

oidcClient.events.addAccessTokenExpiring(function () {
  console.log('AccessToken Expiring：', arguments);
});

oidcClient.events.addAccessTokenExpired(function () {
  console.log('AccessToken Expired：', arguments);
  //alert('Session expired. Going out!');
  oidcClient.signoutRedirect().then(function (resp) {
    console.log('signed out', resp);
  }).catch(function (err) {
    console.log(err)
  })
});

oidcClient.events.addSilentRenewError(function () {
  console.error('Silent Renew Error：', arguments);
});

oidcClient.events.addUserSignedOut(function () {
  //alert('Going out!');
  console.log('UserSignedOut：', arguments);
  oidcClient.signoutRedirect().then(function (resp) {
    console.log('signed out', resp);
  }).catch(function (err) {
    console.log(err)
  })
});

const authService = {
  get userManager() {
    return oidcClient;
  },

  login() {
    return oidcClient.signinRedirect(); // Returns promise to trigger a redirect of the current window to the authorization endpoint.
  },

  async isLoggedIn() {
    const user = await this.getUserInfo();
    const userCurrent = !!user && !user.expired;
    return userCurrent;
  },

  async getUserInfo() {
    return await oidcClient.getUser();
  }
  ,
  async completeLogin() {
    const user = await oidcClient.signinRedirectCallback(); // Returns promise to process response from the authorization endpoint. The result of the promise is the authenticated User
    await oidcClient.storeUser(user);
    return user;
  },

  logout() {
    oidcClient.signoutRedirect(); // Returns promise to trigger a redirect of the current window to the end session endpoint.
  },

  completeLogout() {
    return oidcClient.signoutRedirectCallback(); // Returns promise to process response from the end session endpoint.
  },

  async getAccessToken() {
    const user = await this.getUserInfo(); // Returns promise to load the User object for the currently authenticated user.
    return !!user && !user.expired ? user.access_token : null
  }
}
export default authService

