import React, { Component } from "react";
import firebase from "firebase";
import Router from "next/router";

let firebaseui;

export default class FirebaseAuthentication extends Component {
  componentDidMount() {
    try {
      firebaseui = require("firebaseui");
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
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false,
        },
      ],
      tosUrl: "https://github.com/jonikorpi/kausi/blob/master/TERMS_OF_SERVICE.md",
    });
  }

  componentWillUnMount() {
    window.authUi.reset();
  }

  render() {
    return <div id="firebaseui-auth" />;
  }
}
