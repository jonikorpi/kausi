import React, { Component } from "react";
import firebase from "firebase";

import Head from "../components/Head.js";
import Navigation from "../components/Navigation";
import TimelineNavigation from "../components/TimelineNavigation";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: null,
      anonymous: null,
      connected: false,
      haveConnectedOnce: false,
      error: null,
    }
  }

  componentDidMount() {
    if (firebase.apps.length === 0) {
      firebase.initializeApp({
        authDomain: "muisti-6a29a.firebaseapp.com",
        apiKey: "AIzaSyAF4obcBK8wggQq9klNNkHH-dolEoNhlLM",
        databaseURL: "https://muisti-6a29a.firebaseio.com",
      });
    }

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        this.setState({
          uid: user.uid,
          anonymous: user.isAnonymous,
        });
      }
      else {
        this.setState({
          uid: null,
          anonymous: null,
        });

        firebase.auth().signInAnonymously().catch(function(error) {
          console.log(error);
        });
      }
    }.bind(this));

    firebase.database().ref(".info/connected").on("value", function(online) {
      if (online.val() === true) {
        this.setState({
          connected: true,
          haveConnectedOnce: true,
        });
      }
      else {
        this.setState({connected: false});
      }
    }.bind(this));
  }

  signOut = () => {
    firebase.auth().signOut().then(function(){
      this.setState({
        uid: null,
        anonymous: null,
      });
      this.goToToday();
    }.bind(this)).catch(function(error) {
      console.log(error);
    });
  }

  render() {
    if (!this.state.connected) {
      const spinner = (<div className="spin border border-0-125 dashed round height-1 width-1"></div>);
      const statusText = this.state.haveConnectedOnce ? "OFFLINE: changes will not be saved if you close Kausi now." : "Connecting…"

      const status = (
        <div className="padding-0-75 padding-x bg-5 color-1 fixed position-bottom enter-from-below">
          <div className="padding-0-5 padding-y child-margins-x-0-5 flex">
            {spinner}
            <p>
              {statusText}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div>
        <Head/>
        <Navigation/>
        <TimelineNavigation/>
        <div>Timeline will go here</div>
      </div>
    );
  }
}
