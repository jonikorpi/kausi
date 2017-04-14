import React, { Component } from "react";
import firebase from "firebase";
import Link from "next/link";
import Router from "next/router";

import Head from "../components/Head.js";
import Navigation from "../components/Navigation";
import About from "../components/About";

import initializeFirebase from "../scripts/initializeFirebase.js";

export default class Account extends Component {
  componentDidMount() {
    initializeFirebase();
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
      <div className="padding page">
        <Head />
        <Navigation>
          <Link href="/">
            <a>
              Back
            </a>
          </Link>
        </Navigation>

        <header>
          <h1>Your account</h1>
          <nav className="accountNavigation">
            <Link href="/export-data">
              <a className="padding">
                Export data
              </a>
            </Link>
            <button className="padding" onClick={this.signOut}>Log out</button>
          </nav>
        </header>

        <About />
      </div>
    );
  }
}
