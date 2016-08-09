import React, { Component } from "react";
import reactMixin from "react-mixin";
import Firebase from "firebase";
import ReactFire from "reactfire";

import Controls from "./Controls";

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
    }
  }

  componentWillMount() {
    Firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("User authenticated:");
        console.log(user);
        this.setState({
          user: {
            uid: user.uid,
            anonymous: user.isAnonymous,
          }
        });
        this.subscribeToTodos(this.state.user.uid);
      } else {
        console.log("User not authenticated");
        this.setState({
          user: {
            uid: null,
            anonymous: null,
          }
        });
        this.signIn();
      }
    }.bind(this));
  }

  subscribeToTodos(uid) {
    this.bindAsArray(
      Firebase.database().ref(`users/${uid}`),
      "todos",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
      }
    );
  }

  signIn() {
    console.log("Trying to sign in…");
    Firebase.auth().signInAnonymously().catch(function(error) {
      console.log(error);
    });
  }

  signOut() {
    console.log("Trying to sign out…");
    Firebase.auth().signOut().catch(function(error) {
      console.log(error);
    });
  }

  signUp() {
    console.log("Trying to sign up…");
    // TODO
  }

  render() {
    let controls, message;

    if (this.state.user.uid) {
      controls = (
        <Controls
          user={this.state.user}
          signIn={this.signIn}
          signOut={this.signOut}
          signUp={this.signUp}
        />
      );
    }
    else {
      message = (
        <div className="text-align-center color-bright-5 padding-0-5">
          Connecting…
        </div>
      );
    }

    return (
      <div id="connection" className="flex vertical height-100vh">
        <div id="todos" className="grow">
          todos: {this.state.todos}
        </div>
        {controls}
        {message}
      </div>
    );
  }
}

reactMixin(Connection.prototype, ReactFire);
export default Connection;
