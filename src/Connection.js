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
      connected: false,
      authenticated: false,
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
            authenticated: true,
          }
        });
        this.setupSubscription(this.state.user.uid);
      } else {
        this.setState({
          user: {
            uid: null,
            anonymous: null,
            authenticated: false,
          }
        });
        this.signIn();
      }
    }.bind(this));
  }

  setupSubscription(uid) {
    this.firebaseRef = Firebase.database().ref(uid);

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
        this.setState({connected: true});
      }
      else {
        this.setState({connected: false});
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
    let view;
    switch (this.state.view) {
      case "week":
        view = (
          <Week
            todos={this.state.todos}
            date={this.state.date}
            saveTodo={this.saveTodo}
          />
        );
        break;
      default:
        view = null
    }

    return (
      <div id="connection" className="flex vertical grow">
        <Controls
          user={this.state.user}
          signIn={this.signIn}
          signOut={this.signOut}
          signUp={this.signUp}
          connected={this.state.connected}
        />
        {view}
      </div>
    );
  }
}

reactMixin(Connection.prototype, ReactFire);
export default Connection;
