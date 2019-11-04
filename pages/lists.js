import React, { Component } from "react";
import firebase from "firebase";
import moment from "moment";
import Router from "next/router";

import Head from "../components/Head.js";
import Week from "../components/Week";
import About from "../components/About";

import initializeFirebase from "../helpers/initializeFirebase.js";
import initializeRollbar from "../helpers/initializeRollbar.js";

export default class Lists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: null,
      anonymous: null,
      connected: false,
      haveConnectedOnce: false,
      error: null,
      clientSide: false,
    };
  }

  componentDidMount() {
    this.setState({
      clientSide: true,
    });

    initializeFirebase();

    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          this.setState({
            uid: user.uid,
            anonymous: user.isAnonymous,
          });
        } else {
          this.setState({
            uid: null,
            anonymous: null,
          });

          firebase
            .auth()
            .signInAnonymously()
            .catch(function(error) {
              console.log(error);
            });
        }
      }.bind(this)
    );

    firebase
      .database()
      .ref(".info/connected")
      .on(
        "value",
        function(online) {
          if (online.val() === true) {
            this.setState({
              connected: true,
              haveConnectedOnce: true,
            });
          } else {
            this.setState({ connected: false });
          }
        }.bind(this)
      );
  }

  render() {
    return (
      <>
        {this.state.uid && (
          <p
            style={{
              backgroundColor: "black",
              padding: "0.25rem 0.5rem",
              color: `hsl(0, 50%, 61.8%)`,
              borderBottom: `1px solid hsl(0, 50%, 61.8%)`,
              fontSize: "0.625rem",
              lineHeight: "0.625rem",
              fontWeight: "bold",
            }}
          >
            Kausi will shut down on August 1st 2020.{" "}
            {this.state.anonymous ? (
              <>
                <a href="/authenticate/">Sign in to export your data</a>.
              </>
            ) : (
              <>
                You can <a href="/account/">export your data here</a>.
              </>
            )}
          </p>
        )}

        <div className="timeline page">
          <Head>
            <title>Lists</title>
          </Head>
          <style jsx>
            {`
              .timeline {
                width: 100%;
                position: relative;
                overflow: hidden;
              }
            `}
          </style>

          <Week
            weekOf={moment(0)}
            uid={this.state.uid}
            url={this.props.url}
            query={this.props.url.query}
            anonymous={this.state.anonymous}
            lists={true}
            isVisible={true}
          />
          <div className="padding">
            <About />
          </div>
        </div>
      </>
    );
  }
}
