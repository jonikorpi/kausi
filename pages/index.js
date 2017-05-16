import React, { Component } from "react";
import Router from "next/router";
import firebase from "firebase";
import moment from "moment";
import List from "react-virtualized/dist/commonjs/List";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";

import Head from "../components/Head.js";
import WeekContainer from "../components/WeekContainer";

import initializeFirebase from "../helpers/initializeFirebase.js";
import initializeRollbar from "../helpers/initializeRollbar.js";

const getToday = () => {
  return moment().startOf("day");
};

const startOfTime = moment(0).add(40 * 52, "weeks").startOf("week");

const weekToIndex = day => {
  return moment(day).startOf("week").diff(startOfTime, "weeks");
};

const indexToWeek = index => {
  return moment(startOfTime).add(index, "weeks");
};

export default class Timeline extends Component {
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

    this.scrollToToday();
  }

  setUrlToDay = day => {
    const url = moment().startOf("day").isSame(day)
      ? "/"
      : `/?${moment(day).format("YYYY-MM-DD")}`;
    Router.replace(url, url, { shallow: true });
    this.list && this.list.scrollToRow(weekToIndex(day));
  };

  scrollToToday = () => {
    this.setUrlToDay(getToday());
  };

  focusDay = day => {
    this.setUrlToDay(day);
  };

  rowRenderer = ({ key, index, isScrolling, isVisible, style }) => {
    return (
      <WeekContainer
        key={key}
        index={index}
        weekOf={indexToWeek(index)}
        url={this.props.url}
        query={this.props.url.query}
        anonymous={this.state.anonymous}
        uid={this.state.uid}
        focusDay={this.focusDay}
        scrollToToday={this.scrollToToday}
        style={style}
      />
    );
  };

  render() {
    const query = this.props.url.query && Object.keys(this.props.url.query)[0];
    const scrollToIndex = query
      ? weekToIndex(moment(query))
      : weekToIndex(getToday());

    return (
      <div className="timeline">
        <Head />
        <style jsx>{`
          .timeline {
            width: 100%;
            height: 100vh;
          }
        `}</style>

        {this.state.clientSide
          ? <AutoSizer>
              {({ height, width }) => (
                <List
                  ref={c => (this.list = c)}
                  width={width}
                  height={height}
                  rowCount={weekToIndex(getToday()) + 10 * 52}
                  estimatedRowSize={height * 0.91}
                  rowHeight={height * 0.91}
                  rowRenderer={this.rowRenderer}
                  scrollToIndex={scrollToIndex}
                  scrollToAlignment="start"
                  overscanRowCount={0}
                  uid={this.state.uid}
                  query={this.props.url.query}
                />
              )}
            </AutoSizer>
          : <div>
              {this.rowRenderer({
                key: scrollToIndex + 0,
                index: scrollToIndex + 0,
              })}
              {this.rowRenderer({
                key: scrollToIndex + 1,
                index: scrollToIndex + 1,
              })}
            </div>}
      </div>
    );
  }
}
