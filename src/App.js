import React, { Component } from "react";
import firebase from "firebase";
import shallowCompare from "react-addons-shallow-compare";

import Timeline from "./Timeline";
import SignInUp from "./SignInUp";
import Account from "./Account";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: null,
      anonymous: null,
      view: "timeline",
      connected: false,
      haveConnectedOnce: false,
      error: null,
    }

    this.signUp = this.signUp.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.requestPasswordReset = this.requestPasswordReset.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.goToSignInUp = this.goToSignInUp.bind(this);
    this.goToToday = this.goToToday.bind(this);
    this.goToAccount = this.goToAccount.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentDidMount() {
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

  signOut() {
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

  signUp(email, password) {
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

  goToSignInUp() {
    this.setState({view: "signInUp", error: null});
  }

  goToAccount() {
    this.setState({view: "account", error: null});
  }

  goToToday() {
    this.setState({view: "timeline"});
  }

  render() {
    let view, status;

    switch (this.state.view) {
      case "signInUp":
        view = (
          <SignInUp
            signUp={this.signUp}
            signIn={this.signIn}
            requestPasswordReset={this.requestPasswordReset}
            error={this.state.error}
            goToToday={this.goToToday}
          />
        );
        break;
      case "account":
        view = (
          <Account
            signOut={this.signOut}
            setPassword={this.setPassword}
            error={this.state.error}
            uid={this.state.uid}
            goToToday={this.goToToday}
          />
        );
        break;
      case "timeline":
      default:
        view = (
          <Timeline
            connected={this.state.connected}
            anonymous={this.state.anonymous}
            uid={this.state.uid}
            haveConnectedOnce={this.state.haveConnectedOnce}
            goToAccount={this.goToAccount}
            goToSignInUp={this.goToSignInUp}
          />
        );
        break;
    }

    if (!this.state.connected) {
      const spinner = (<div className="spin border border-0-125 dashed round height-1 width-1"></div>);
      const statusText = this.state.haveConnectedOnce ? "OFFLINE: any changes made will not be saved until this message disappears. If you close Kausi any unsaved changes will be lost." : "Connecting…"

      status = (
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
      <div id="connection" className="flex vertical grow">
        {view}
        {status}
      </div>
    );
  }
}

export default App;
