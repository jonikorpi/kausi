import React, { Component } from "react";
import reactMixin from "react-mixin";
import Firebase from "firebase";
import ReactFire from "reactfire";
import moment from "moment";

import Controls from "./Controls";
import Weeks from "./Weeks";
import Month from "./Month";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Account from "./Account";

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
      error: null,
    }

    this.weekRange = 3;

    this.saveTodo = this.saveTodo.bind(this);
    this.showSignUp = this.showSignUp.bind(this);
    this.signUp = this.signUp.bind(this);
    this.showSignIn = this.showSignIn.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.goToDay = this.goToDay.bind(this);
    this.goToToday = this.goToToday.bind(this);
    this.goToAccount = this.goToAccount.bind(this);
    this.setTodayRefreshTimer = this.setTodayRefreshTimer.bind(this);
    this.moveBackward = this.moveBackward.bind(this);
    this.moveForward = this.moveForward.bind(this);
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

        Firebase.auth().signInAnonymously().catch(function(error) {
          console.log(error);
        });
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

  componentDidMount() {
    this.setTodayRefreshTimer();
  }

  setTodayRefreshTimer() {
    window.setTimeout(
      function(){
        if (this.state.today.valueOf() === this.state.targetDay.valueOf() && this.state.view === "week") {
          this.setState({targetDay: moment().startOf("day")});
        }
        this.setState({today: moment().startOf("day")});
        this.setTodayRefreshTimer();
      }.bind(this),
      moment().add(1, "day").startOf("day").valueOf() - moment().valueOf()
    );
  }

  signOut() {
    Firebase.auth().signOut().then(function(){
      this.goToToday();
    }.bind(this)).catch(function(error) {
      console.log(error);
    });
  }

  signUp(email, password) {
    this.setState({error: null});
    if (email && password) {
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
        this.setState({error: error.message})
      }.bind(this));
    }
    else {
      this.setState({error: "Invalid email or password."});
    }
  }

  showSignUp() {
    this.setState({view: "signUp"});
  }

  signIn(email, password) {
    this.setState({error: null});
    if (email && password) {
      Firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
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

  showSignIn() {
    this.setState({view: "signIn"});
  }

  goToToday() {
    this.setState({view: "week", targetDay: this.state.today});
  }

  goToDay(day) {
    this.setState({view: "week", targetDay: day});
  }

  goToAccount() {
    this.setState({view: "account"});
  }

  moveBackward() {
    this.setState({
      view: "month",
      targetDay: moment(this.state.targetDay).startOf("isoweek").subtract(this.weekRange, "weeks"),
    });
  }

  moveForward() {
    this.setState({
      view: "month",
      targetDay: moment(this.state.targetDay).startOf("isoweek").add(this.weekRange, "weeks"),
    });
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
    // console.log("targetDay is now " + this.state.targetDay.format("ddd DD MM HH:mm"))

    let view = (
      <div className="grow"/>
    );

    if (this.state.firebaseRef) {
      switch (this.state.view) {
        case "signUp":
          view = (
            <SignUp signUp={this.signUp} error={this.state.error}/>
          );
          break;
        case "signIn":
          view = (
            <SignIn signIn={this.signIn} error={this.state.error}/>
          );
          break;
        case "account":
          view = (
            <Account signOut={this.signOut}/>
          );
          break;
        case "month":
          view = (
            <Month
              today={this.state.today}
              targetDay={this.state.targetDay}
              goToDay={this.goToDay}
              firebaseRef={this.state.firebaseRef}
              weekRange={this.weekRange}
            />
          );
          break;
        case "week":
        default:
          view = (
            <Weeks
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
          targetIsToday={this.state.targetDay.valueOf() === this.state.today.valueOf()}
          goToToday={this.goToToday}
          goToAccount={this.goToAccount}
          zoomOut={this.zoomOut}
          view={this.state.view}
          moveBackward={this.moveBackward}
          moveForward={this.moveForward}
        />
      </div>
    );
  }
}

reactMixin(Connection.prototype, ReactFire);
export default Connection;
