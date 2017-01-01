import React, { Component } from "react";
import firebase from "firebase";
import Link from "next/link";

import Head from "../components/Head.js";
import Navigation from "../components/Navigation";

import initializeFirebase from "../scripts/initializeFirebase.js";

export default class SignUp extends Component {
  componentDidMount() {
    initializeFirebase();
  }

  signUp = (email, password) => {
    this.setState({error: null});
    if (email && password) {
      const credential = firebase.auth.EmailAuthProvider.credential(email, password);
      firebase.auth().currentUser.link(credential).then(function(user) {
        this.setState({
          uid: user.uid,
          anonymous: false,
        });
        this.goToToday();
      }.bind(this), function(error) {
        console.log("Error upgrading anonymous account", error);
        this.setState({error: error.message})
      }.bind(this));
    }
    else {
      this.setState({error: "Invalid email or password."});
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
