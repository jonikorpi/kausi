import React, { Component } from "react";
import firebase from "firebase";
import moment from "moment";

import Controls from "./Controls";
import Weeks from "./Weeks";
import Month from "./Month";
import SignInUp from "./SignInUp";
import Account from "./Account";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        uid: null,
        anonymous: null,
      },
      view: "week",
      today: moment().startOf("day"),
      targetDay: moment().startOf("day"),
      connected: false,
      haveConnectedOnce: false,
      firebaseRef: false,
      error: null,
      dateUpdater: null,
    }

    this.weekRange = 3;

    this.saveTodo = this.saveTodo.bind(this);
    this.signUp = this.signUp.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.requestPasswordReset = this.requestPasswordReset.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.goToSignInUp = this.goToSignInUp.bind(this);
    this.goToDay = this.goToDay.bind(this);
    this.goToMonth = this.goToMonth.bind(this);
    this.goToToday = this.goToToday.bind(this);
    this.goToAccount = this.goToAccount.bind(this);
    this.moveBackward = this.moveBackward.bind(this);
    this.moveForward = this.moveForward.bind(this);
  }

  componentDidMount() {
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

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        this.setState({
          user: {
            uid: user.uid,
            anonymous: user.isAnonymous,
          },
          firebaseRef: firebase.database().ref(user.uid),
        });
      }
      else {
        this.setState({
          user: {
            uid: null,
            anonymous: null,
          }
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

  componentWillUnmount() {
    clearInterval(this.state.dateUpdater);
  }

  signOut() {
    firebase.auth().signOut().then(function(){
      this.goToToday();
    }.bind(this)).catch(function(error) {
      console.log(error);
    });
  }

  signUp(email, password) {
    this.setState({error: null});
    if (email && password) {
      const credential = firebase.auth.EmailAuthProvider.credential(email, password);
      firebase.auth().currentUser.link(credential).then(function(user) {
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

  setPassword(password, passwordAgain) {
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

  requestPasswordReset(email) {
    firebase.auth().sendPasswordResetEmail(email).then(function() {
      this.setState({error: "Password reset link sent to your email."})
    }.bind(this), function(error) {
      this.setState({error: error.message})
    }.bind(this));
  }

  signIn(email, password) {
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

  goToToday() {
    this.setState({view: "week", targetDay: this.state.today});
  }

  goToMonth() {
    this.setState({view: "month"});
  }

  goToDay(day) {
    this.setState({view: "week", targetDay: day});
  }

  goToSignInUp() {
    this.setState({view: "signInUp", error: null});
  }

  goToAccount() {
    this.setState({view: "account", error: null});
  }

  moveBackward() {
    const weeksToMove = this.state.view === "month" ? this.weekRange : 1;
    this.setState({
      targetDay: moment(this.state.targetDay).startOf("isoweek").subtract(weeksToMove, "weeks"),
    });
  }

  moveForward() {
    const weeksToMove = this.state.view === "month" ? this.weekRange : 1;
    this.setState({
      targetDay: moment(this.state.targetDay).startOf("isoweek").add(weeksToMove, "weeks"),
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
      <div className="flex grow vertical child-borders-y">
        <div className="focused-week bg-2 border-color-2"></div>
        <div className="week border-color-2"></div>
        <div className="week border-color-2"></div>
      </div>
    );

    if (this.state.firebaseRef) {
      switch (this.state.view) {
        case "signInUp":
          view = (
            <SignInUp
              signUp={this.signUp}
              signIn={this.signIn}
              requestPasswordReset={this.requestPasswordReset}
              error={this.state.error}
            />
          );
          break;
        case "account":
          view = (
            <Account
              signOut={this.signOut}
              setPassword={this.setPassword}
              error={this.state.error}
              firebaseRef={this.state.firebaseRef}
            />
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
              connected={this.state.connected}
              anonymous={this.state.user.anonymous}
              today={this.state.today}
              targetDay={this.state.targetDay}
              saveTodo={this.saveTodo}
              firebaseRef={this.state.firebaseRef}
              haveConnectedOnce={this.state.haveConnectedOnce}
            />
          );
          break;
      }
    }

    return (
      <div id="connection" className="flex vertical grow">
        <Controls
          anonymous={this.state.user.anonymous}
          connected={this.state.connected}
          haveConnectedOnce={this.state.haveConnectedOnce}
          targetIsToday={this.state.targetDay.valueOf() === this.state.today.valueOf()}
          view={this.state.view}
          goToToday={this.goToToday}
          goToAccount={this.goToAccount}
          goToSignInUp={this.goToSignInUp}
          goToMonth={this.goToMonth}
          moveBackward={this.moveBackward}
          moveForward={this.moveForward}
        />
        {view}
      </div>
    );
  }
}

export default App;
