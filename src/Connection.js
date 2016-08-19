import React, { Component } from "react";
import reactMixin from "react-mixin";
import Firebase from "firebase";
import ReactFire from "reactfire";
import moment from "moment";

import Controls from "./Controls";
import Weeks from "./Weeks";
import Month from "./Month";
import SignInUp from "./SignInUp";
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
      dateUpdater: null,
    }

    this.weekRange = 3;

    this.saveTodo = this.saveTodo.bind(this);
    this.signUp = this.signUp.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.goToSignInUp = this.goToSignInUp.bind(this);
    this.goToDay = this.goToDay.bind(this);
    this.goToMonth = this.goToMonth.bind(this);
    this.goToToday = this.goToToday.bind(this);
    this.goToSomeday = this.goToSomeday.bind(this);
    this.goToAccount = this.goToAccount.bind(this);
    this.moveBackward = this.moveBackward.bind(this);
    this.moveForward = this.moveForward.bind(this);
  }

  componentWillMount() {
    const dateUpdater = setInterval(
      function() {
        const startOfToday = moment().startOf("day");

        if (!this.state.today.isSame(startOfToday)) {
          if (this.state.today.isSame(this.state.targetDay) && this.state.view === "week") {
            this.setState({targetDay: startOfToday});
          }
          this.setState({today: startOfToday});
        }
      }.bind(this),
      2*1000*60
    );

    this.setState({dateUpdater: dateUpdater});

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

  componentWillUnmount() {
    clearInterval(this.state.dateUpdater);
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

  goToToday() {
    this.setState({view: "week", targetDay: this.state.today});
  }

  goToMonth() {
    this.setState({view: "month"});
  }

  goToSomeday() {
    this.setState({view: "someday"});
  }

  goToDay(day) {
    this.setState({view: "week", targetDay: day});
  }

  goToSignInUp() {
    this.setState({view: "signInUp"});
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
        case "signInUp":
          view = (
            <SignInUp signUp={this.signUp} signIn={this.signIn} error={this.state.error}/>
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
              moveBackward={this.moveBackward}
              moveForward={this.moveForward}
            />
          );
          break;
        case "someday":
          view = (
            <Weeks
              today={this.state.today}
              targetDay={this.state.targetDay}
              saveTodo={this.saveTodo}
              firebaseRef={this.state.firebaseRef}
              someday={true}
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
          targetIsToday={this.state.targetDay.valueOf() === this.state.today.valueOf()}
          view={this.state.view}
          goToToday={this.goToToday}
          goToSomeday={this.goToSomeday}
          goToAccount={this.goToAccount}
          goToSignInUp={this.goToSignInUp}
          goToMonth={this.goToMonth}
        />
      </div>
    );
  }
}

reactMixin(Connection.prototype, ReactFire);
export default Connection;
