import React, { Component } from "react";
import firebase from "firebase";
import Link from "next/link";

import Head from "../components/Head.js";
import Navigation from "../components/Navigation";

import initializeFirebase from "../scripts/initializeFirebase.js";

export default class SignIn extends Component {
  componentDidMount() {
    initializeFirebase();
  }

  signIn = (email, password) => {
    this.setState({error: null});
    if (email && password) {
      firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
        this.goToToday();
      }.bind(this), function(error) {
        console.log("Error signing in", error);
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
