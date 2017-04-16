import React, { Component } from "react";
import Link from "next/link";

import Head from "../components/Head.js";
import Navigation from "../components/Navigation";
import About from "../components/About";
import FirebaseAuthentication from "../components/FirebaseAuthentication";

import initializeFirebase from "../scripts/initializeFirebase.js";
import initializeRollbar from "../scripts/initializeRollbar.js";

export default class Authenticate extends Component {
  constructor(props) {
    super(props);

    this.state = { clientSide: false };
  }

  componentDidMount() {
    initializeFirebase();
    this.setState({ clientSide: true });
  }

  render() {
    return (
      <div>
        <Navigation url={this.props.url} uid={true} anonymous={true} />

        <Head>
          <link
            type="text/css"
            rel="stylesheet"
            href="https://cdn.firebase.com/libs/firebaseui/1.0.1/firebaseui.css"
          />
        </Head>
        <div className="page padding">
          <header className="child-spacing">
            <h1 className="heading">Authentication</h1>
            <p>
              Kausi uses
              {" "}
              <a href="https://firebase.google.com">Firebase</a>
              {" "}
              to store your data. Log in or sign up for an account below.
            </p>
          </header>

          {this.state.clientSide && <FirebaseAuthentication />}

          <About />
        </div>
      </div>
    );
  }
}
