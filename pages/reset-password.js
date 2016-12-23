import React, { Component } from "react";
import firebase from "firebase";
import Link from "next/link";

import Head from "../components/Head.js";
import Navigation from "../components/Navigation";

export default class ResetPassword extends Component {
  requestPasswordReset = (email) => {
    firebase.auth().sendPasswordResetEmail(email).then(function() {
      this.setState({error: "Password reset link sent to your email."})
    }.bind(this), function(error) {
      this.setState({error: error.message})
    }.bind(this));
  }

  render() {
    return (
      <div>
        <Head/>
        <Navigation/>
      </div>
    );
  }
}
