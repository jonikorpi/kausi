import React, { Component } from "react";
import firebase from "firebase";
import Router from "next/router";

export default class FirebaseAuthentication extends Component {
  componentDidMount() {
    try {
      const firebaseui = require("firebaseui");
      window.authUi = new firebaseui.auth.AuthUI(firebase.auth());
    } catch (err) {
      if (!/already exists/.test(err.message)) {
        console.error("Firebase initialization error", err.stack);
      }
    }

    window.authUi.start("#firebaseui-auth", {
      callbacks: {
        signInSuccess: user => {
          Router.push("/");
        },
      },
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      signInOptions: [
        // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ],
    });
  }

  componentWillUnMount() {
    authUi.reset();
  }

  render() {
    return <div id="firebaseui-auth" />;
  }
}
