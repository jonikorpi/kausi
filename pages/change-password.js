import React, { Component } from "react";
import firebase from "firebase";
import Link from "next/link";

import Head from "../components/Head.js";
import Navigation from "../components/Navigation";

import initializeFirebase from "../scripts/initializeFirebase.js";

export default class ChangePassword extends Component {
  componentDidMount() {
    initializeFirebase();
  }

  setPassword = (password, passwordAgain) => {
    if (password && password === passwordAgain) {
      firebase.auth().currentUser.updatePassword(password).then(function() {
        this.setState({error: "Password changed."})
      }.bind(this), function(error) {
        this.setState({error: error.message})
      }.bind(this));
    }
    else {
      this.setState({error: "New passwords do not match."})
    }
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
