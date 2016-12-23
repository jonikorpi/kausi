import React, { Component } from "react";
// import firebase from "firebase";
import List from "react-list";
import moment from "moment";

import Head from "../components/Head.js";
import TimelineNavigation from "../components/TimelineNavigation";

export default class Timeline extends Component {
  constructor(props) {
    super(props);

    this.startIndex = 500;

    this.state = {
      uid: null,
      anonymous: null,
      connected: false,
      haveConnectedOnce: false,
      error: null,
      clientSide: false,
    }
  }

  componentDidMount() {
    this.setState({clientSide: true});

    // if (firebase.apps.length === 0) {
    //   firebase.initializeApp({
    //     authDomain: "muisti-6a29a.firebaseapp.com",
    //     apiKey: "AIzaSyAF4obcBK8wggQq9klNNkHH-dolEoNhlLM",
    //     databaseURL: "https://muisti-6a29a.firebaseio.com",
    //   });
    // }
    //
    // firebase.auth().onAuthStateChanged(function(user) {
    //   if (user) {
    //     this.setState({
    //       uid: user.uid,
    //       anonymous: user.isAnonymous,
    //     });
    //   }
    //   else {
    //     this.setState({
    //       uid: null,
    //       anonymous: null,
    //     });
    //
    //     firebase.auth().signInAnonymously().catch(function(error) {
    //       console.log(error);
    //     });
    //   }
    // }.bind(this));
    //
    // firebase.database().ref(".info/connected").on("value", function(online) {
    //   if (online.val() === true) {
    //     this.setState({
    //       connected: true,
    //       haveConnectedOnce: true,
    //     });
    //   }
    //   else {
    //     this.setState({connected: false});
    //   }
    // }.bind(this));
  }

  scrollToToday = () => {
    this.list.scrollTo(this.startIndex);
  }

  signOut = () => {
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

  renderWeek = (index, key) => {
    return (
      <div key={key} style={{height: "100vh"}}>
        {index}
      </div>
    )
  }

  render() {
    if (!this.state.connected) {
      const spinner = (<div className="spin border border-0-125 dashed round height-1 width-1"></div>);
      const statusText = this.state.haveConnectedOnce ? "OFFLINE: changes will not be saved if you close Kausi now." : "Connecting…"

      const status = (
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
      <div>
        <Head/>

        {this.state.clientSide && (
          <List
            ref={c => this.list = c}
            itemRenderer={this.renderWeek}
            length={this.startIndex * 2}
            type="uniform"
            pageSize={3}
            initialIndex={this.startIndex}
          />
        )}

        <TimelineNavigation scrollToToday={this.scrollToToday}/>
      </div>
    );
  }
}
