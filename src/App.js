import React, { Component } from "react";
import firebase from "firebase";

import Controls from "./Controls";
import Timeline from "./Timeline";
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

  componentDidMount() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        this.setState({
          user: {
            uid: user.uid,
            anonymous: user.isAnonymous,
          },
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

  signOut() {
    firebase.auth().signOut().then(function(){
      this.setState({
        user: {
          uid: null,
          anonymous: null,
        },
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
          user: {
            uid: user.uid,
            anonymous: false,
          },
          view: "timeline"
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
    let view;

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
            uid={this.state.user.uid}
          />
        );
        break;
      case "timeline":
      default:
        view = (
          <Timeline
            connected={this.state.connected}
            anonymous={this.state.user.anonymous}
            uid={this.state.user.uid}
            haveConnectedOnce={this.state.haveConnectedOnce}
          />
        );
        break;
    }

    return (
      <div id="connection" className="flex vertical grow">
        {view}
        <Controls
          anonymous={this.state.user.anonymous}
          connected={this.state.connected}
          haveConnectedOnce={this.state.haveConnectedOnce}
          view={this.state.view}
          goToToday={this.goToToday}
          goToAccount={this.goToAccount}
          goToSignInUp={this.goToSignInUp}
        />
      </div>
    );
  }
}

export default App;
