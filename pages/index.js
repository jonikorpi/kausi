import React, { Component } from "react";
import firebase from "firebase";
import moment from "moment";

import Head from "../components/Head.js";
import TimelineNavigation from "../components/TimelineNavigation";
import Week from "../components/Week";

import initializeFirebase from "../scripts/initializeFirebase.js";

export default class Timeline extends Component {
  constructor(props) {
    super(props);

    this.startIndex = 1000;

    this.state = {
      today: moment().startOf("day"),
      uid: null,
      anonymous: null,
      connected: false,
      haveConnectedOnce: false,
      error: null,
      clientSide: false,
    }
  }

  componentDidMount() {
    const updateTodayHandler = setTimeout(
      this.updateToday,
      moment(this.state.today).add(1, "days").diff(this.state.today)
    );

    this.setState({
      updateTodayHandler: updateTodayHandler,
      clientSide: true,
    });

    initializeFirebase();

    firebase.auth().onAuthStateChanged(function (user) {
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

        firebase.auth().signInAnonymously().catch(function (error) {
          console.log(error);
        });
      }
    }.bind(this));

    firebase.database().ref(".info/connected").on("value", function (online) {
      if (online.val() === true) {
        this.setState({
          connected: true,
          haveConnectedOnce: true,
        });
      }
      else {
        this.setState({ connected: false });
      }
    }.bind(this));
  }

  componentWillUnmount() {
    clearTimeout(this.state.updateTodayHandler);
  }

  updateToday = () => {
    const newToday = moment().startOf("day");

    if (!this.state.today.isSame(newToday)) {
      console.log("Reloading because date has changed");
      window.location.reload();
    }
  }

  getIndexFromDay = (day) => {
    return (
      this.startIndex
      + moment(day).startOf("isoweek").diff(moment(this.state.today).startOf("isoweek"), "weeks")
    );
  }

  setUrlToDay = (day) => {
    this.props.url.replace(`/?${moment(day).format("YYYY-MM-DD")}`);
  }

  scrollToToday = () => {
    this.setUrlToDay(this.state.today);
    this.list.scrollTo(this.startIndex);
  }

  focusDay = (day) => {
    const targetIndex = this.getIndexFromDay(day);
    this.setUrlToDay(day);
    this.list.scrollTo(targetIndex);
  }

  signOut = () => {
    firebase.auth().signOut().then(function () {
      this.setState({
        uid: null,
        anonymous: null,
      });
      this.goToToday();
    }.bind(this)).catch(function (error) {
      console.log(error);
    });
  }

  renderWeek = (index, key) => {
    return (
      <Week
        key={key}
        index={key}
        weekOf={moment(this.state.today).startOf("isoweek").subtract(this.startIndex - index, "weeks")}
        uid={this.state.uid}
        focusDay={this.focusDay}
        today={this.state.today}
      />
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

    let initialDayIndex = this.startIndex;
    const query = Object.keys(this.props.url.query)[0];

    if (query) {
      initialDayIndex = this.getIndexFromDay(moment(query));
    }

    return (
      <div>
        <Head />

        <style jsx>{`
          html {
            font-size: 133%; /* Fallback: used if browser doesn't support calc() */
            font-size: calc(0.95em + 0.5vw + 0.5vh + 0.25vmin);
          }
        `}</style>

        {/*{this.state.clientSide && (
          <List
            ref={c => this.list = c}
            itemRenderer={this.renderWeek}
            length={this.startIndex * 2}
            type="uniform"
            pageSize={2}
            threshold={window.innerHeight * 0.1}
            initialIndex={initialDayIndex}
          />
        )}*/}

        <TimelineNavigation scrollToToday={this.scrollToToday} />
      </div>
    );
  }
}
