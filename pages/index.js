import React, { Component } from "react";
import firebase from "firebase";
import moment from "moment";
import { List, AutoSizer, WindowScroller } from "react-virtualized";

import Head from "../components/Head.js";
import TimelineNavigation from "../components/TimelineNavigation";
import Week from "../components/Week";

import initializeFirebase from "../scripts/initializeFirebase.js";

export default class Timeline extends Component {
  constructor(props) {
    super(props);

    this.startIndex = 400;

    this.state = {
      today: moment().startOf("day"),
      uid: null,
      anonymous: null,
      connected: false,
      haveConnectedOnce: false,
      error: null,
      clientSide: false,
    };
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

          firebase.auth().signInAnonymously().catch(function(error) {
            console.log(error);
          });
        }
      }.bind(this)
    );

    firebase.database().ref(".info/connected").on(
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

  componentWillUnmount() {
    clearTimeout(this.state.updateTodayHandler);
  }

  updateToday = () => {
    const newToday = moment().startOf("day");

    if (window && !this.state.today.isSame(newToday)) {
      console.log("Reloading because date has changed");
      window.location.reload();
    }
  };

  getIndexFromDay = day => {
    return this.startIndex +
      moment(day)
        .startOf("isoweek")
        .diff(moment(this.state.today).startOf("isoweek"), "weeks");
  };

  setUrlToDay = day => {
    this.props.url.replace(`/?${moment(day).format("YYYY-MM-DD")}`);
  };

  scrollToToday = () => {
    this.setUrlToDay(this.state.today);
    this.list.scrollTo(this.startIndex);
  };

  focusDay = day => {
    const targetIndex = this.getIndexFromDay(day);
    this.setUrlToDay(day);
    this.list.scrollTo(targetIndex);
  };

  signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(
        function() {
          this.setState({
            uid: null,
            anonymous: null,
          });
          this.goToToday();
        }.bind(this)
      )
      .catch(function(error) {
        console.log(error);
      });
  };

  rowRenderer = (
    {
      key,
      index,
      isScrolling,
      isVisible,
      style,
    }
  ) => {
    return (
      <Week
        key={key}
        index={index}
        weekOf={moment(this.state.today)
          .startOf("isoweek")
          .subtract(this.startIndex - index, "weeks")}
        uid={this.state.uid}
        focusDay={this.focusDay}
        today={this.state.today}
        isVisible={isVisible}
        style={style}
      />
    );
  };

  render() {
    const noWindow = typeof window === "undefined";
    let initialDayIndex = this.startIndex;
    const query = Object.keys(this.props.url.query)[0];

    if (query) {
      initialDayIndex = this.getIndexFromDay(moment(query));
    }

    return (
      <div className="timeline">
        <Head />
        <style jsx>
          {
            `
          .timeline {
            width: 100%;
            position: relative;
          }
          `
          }
        </style>

        {this.state.clientSide &&
          <AutoSizer>
            {({ height, width }) => (
              <WindowScroller>
                {({ height, isScrolling, scrollTop }) => (
                  <List
                    width={width}
                    height={height}
                    rowCount={this.startIndex * 2}
                    rowHeight={height * 0.91}
                    rowRenderer={this.rowRenderer}
                    scrollToIndex={this.startIndex}
                    scrollToAlignment="start"
                    scrollTop={scrollTop}
                    isScrolling={isScrolling}
                  />
                )}
              </WindowScroller>
            )}
          </AutoSizer>}

        <TimelineNavigation scrollToToday={this.scrollToToday} />
      </div>
    );
  }
}
