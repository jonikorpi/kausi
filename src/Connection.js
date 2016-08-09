import React, { Component } from "react";
import reactMixin from "react-mixin";
import Firebase from "firebase";
import ReactFire from "reactfire";
import moment from "moment";

import Controls from "./Controls";
import Week from "./Week";
// import Day from "./Day";
// import Month from "./Month";
// import Year from "./Year";

class Connection extends Component {
  constructor(props) {
    super(props);

    Firebase.initializeApp({
      authDomain: "muisti-6a29a.firebaseapp.com",
      apiKey: "AIzaSyAF4obcBK8wggQq9klNNkHH-dolEoNhlLM",
      databaseURL: "https://muisti-6a29a.firebaseio.com",
    });

    this.state = {
      user: {
        uid: null,
        anonymous: null,
      },
      todos: [],
      view: "week",
      date: moment().startOf("day"),
      message: "Loading…",
    }

    this.saveTodo = this.saveTodo.bind(this);
  }

  componentWillMount() {
    Firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        this.setState({
          user: {
            uid: user.uid,
            anonymous: user.isAnonymous,
          }
        });
        this.setupSubscription(this.state.user.uid);
      } else {
        this.setState({
          user: {
            uid: null,
            anonymous: null,
            message: "Connecting…",
          }
        });
        this.signIn();
      }
    }.bind(this));
  }

  setupSubscription(uid) {
    this.firebaseRef = Firebase.database().ref(uid);

    this.setState({message: false});

    this.bindAsArray(
      this.firebaseRef,
      "todos",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
      }
    );

    Firebase.database().ref(".info/connected").on("value", function(online) {
      if (online.val() === true) {
        this.setState({message: false});
      }
      else {
        this.setState({message: "Connecting…"});
      }
    }.bind(this));
  }

  signIn() {
    Firebase.auth().signInAnonymously().catch(function(error) {
      console.log(error);
    });
  }

  signOut() {
    Firebase.auth().signOut().catch(function(error) {
      console.log(error);
    });
  }

  signUp() {
    // TODO
  }

  saveTodo(key, day, text) {
    if (!key && text) {
      key = this.firebaseRef.push().key;
    }
    if (key) {
      if (text) {
        this.firebaseRef.update({
          [key]: {
            date: day,
            text: text,
          }
        });
      }
      else {
        this.firebaseRef.update({
          [key]: null
        });
      }
    }
  }

  render() {
    let controls, message, view;

    if (this.state.message) {
      message = (
        <div className="text-align-center color-bright-1 all-caps bg-4 padding-0-5">
          {this.state.message}
        </div>
      );
    }
    else if (this.state.user.uid) {
      controls = (
        <Controls
          user={this.state.user}
          signIn={this.signIn}
          signOut={this.signOut}
          signUp={this.signUp}
        />
      );
    }

    switch (this.state.view) {
      case "week":
      default:
        view = (
          <Week
            todos={this.state.todos}
            date={this.state.date}
            saveTodo={this.saveTodo}
          />
        );
    }

    return (
      <div id="connection" className="flex vertical height-100vh">
        {view}
        {controls}
        {message}
      </div>
    );
  }
}

reactMixin(Connection.prototype, ReactFire);
export default Connection;
