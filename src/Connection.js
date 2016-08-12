import React, { Component } from "react";
import reactMixin from "react-mixin";
import Firebase from "firebase";
import ReactFire from "reactfire";
import moment from "moment";

import Controls from "./Controls";
import Week from "./Week";
import SignUp from "./SignUp";
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
      view: "week",
      today: moment().startOf("day"),
      targetDay: moment().startOf("day"),
      connected: false,
      firebaseRef: false,
    }

    this.saveTodo = this.saveTodo.bind(this);
    this.showSignUp = this.showSignUp.bind(this);
    this.signUp = this.signUp.bind(this);
    this.showSignIn = this.showSignIn.bind(this);
    this.goToToday = this.goToToday.bind(this);
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

        this.setState({firebaseRef: Firebase.database().ref(user.uid)})
      }
      else {
        this.setState({
          user: {
            uid: null,
            anonymous: null,
          }
        });
        this.signIn();
      }
    }.bind(this));

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

  signUp(email, password) {
    const credential = Firebase.auth.EmailAuthProvider.credential(email, password);
    Firebase.auth().currentUser.link(credential).then(function(user) {
      this.setState({
        user: {
          uid: user.uid,
          anonymous: false,
        },
        view: "week"
      });
    }.bind(this), function(error) {
      console.log("Error upgrading anonymous account", error);
    });
  }

  showSignUp() {
    this.setState({view: "signUp"});
  }

  showSignIn() {
    this.setState({view: "signIn"});
  }

  goToToday() {
    this.setState({view: "week", targetDay: this.state.today});
  }

  saveTodo(key, day, text) {
    if (this.state.firebaseRef) {
      if (!key && text) {
        key = this.state.firebaseRef.push().key;
      }
      if (key) {
        if (text) {
          this.state.firebaseRef.update({
            [key]: {
              date: day,
              text: text,
            }
          });
        }
        else {
          this.state.firebaseRef.update({
            [key]: null
          });
        }
      }
    }
  }

  render() {
    let view = (
      <div className="grow"/>
    );

    if (this.state.firebaseRef) {
      switch (this.state.view) {
        case "signUp":
          view = (
            <SignUp signUp={this.signUp}/>
          );
          break;
        case "week":
        default:
          view = (
            <Week
              today={this.state.today}
              targetDay={this.state.targetDay}
              saveTodo={this.saveTodo}
              firebaseRef={this.state.firebaseRef}
            />
          );
          break;
      }
    }

    return (
      <div id="connection" className="flex vertical grow">
        {view}
        <Controls
          user={this.state.user}
          connected={this.state.connected}
          signIn={this.showSignIn}
          signOut={this.signOut}
          signUp={this.showSignUp}
          goToToday={this.goToToday}
          view={this.state.view}
        />
      </div>
    );
  }
}

reactMixin(Connection.prototype, ReactFire);
export default Connection;
