import React, { Component } from "react";
import firebase from "firebase";
import Router from "next/router";

import Head from "../components/Head.js";
import Navigation from "../components/Navigation";
import About from "../components/About";
import ExportData from "../components/ExportData";

import initializeFirebase from "../helpers/initializeFirebase.js";
import initializeRollbar from "../helpers/initializeRollbar.js";

export default class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    initializeFirebase();

    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          this.setState({
            uid: user.uid,
            anonymous: user.isAnonymous,
            user: user,
          });
        } else {
          this.setState({
            uid: null,
            anonymous: null,
          });

          firebase.auth().signInAnonymously().catch(function(error) {
            console.log(error);
          });
        }
      }.bind(this)
    );
  }

  signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        Router.push("/");
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        <Head />
        <Navigation url={this.props.url} uid={true} anonymous={false} />

        <div className="page padding">
          <h1 className="heading">Your account</h1>

          {this.state.user &&
            <div className="child-spacing centered">

              <div>
                <h1 className="heading bright">{this.state.user.email}</h1>
                <button onClick={this.signOut}>
                  Log out
                </button>
              </div>

              <div className="child-spacing">
                <div>
                  <h1 className="heading bright">Export your data</h1>
                  <ExportData uid={this.state.uid} />
                </div>
              </div>
            </div>}

          <About />
        </div>
      </div>
    );
  }
}
