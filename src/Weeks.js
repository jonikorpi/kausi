import React, { Component } from "react";
import moment from "moment";
import classNames from "classnames";

import WeekContainer from "./WeekContainer";

class Weeks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedDay: null,
    };
    this.focusDay = this.focusDay.bind(this);
    this.unfocusDay = this.unfocusDay.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.targetDay !== this.props.targetDay) {
      this.setState({focusedDay: null});
    }
  }

  focusDay(day, textarea) {
    this.setState({focusedDay: day});
    this.scrollTo(textarea);
  }

  unfocusDay(day) {
    this.setState({focusedDay: null});
  }

  scrollTo(element) {
    const target = element.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const pixels = target.left - (windowWidth * 0.5) + (target.width * 0.5);
    this.weekScroller.scrollLeft += pixels;
  }

  render() {
    let weeks, startAt, endAt, alsoStartAt, alsoEndAt;
    const firstOfThisWeek = moment(this.props.targetDay).startOf("isoweek");
    // const firstOfLastWeek = moment(firstOfThisWeek).subtract(7, "days");
    const firstOfNextWeek = moment(firstOfThisWeek).add(7, "days");

    startAt = moment(firstOfThisWeek)/*.subtract(7, "days")*/.valueOf();
    endAt = moment(firstOfThisWeek).add(15, "days").valueOf();

    alsoStartAt = 0;
    alsoEndAt = moment(0).add(7, "days").valueOf();

    let somedays = {days: [], somedays: true}
    // let lastWeek = {days: []};
    let thisWeek = {days: []};
    let nextWeek = {days: []};

    for (let i = 0; i < 7; i++) {
      somedays.days.push(moment(0).add(i, "days"));
    }

    // for (let i = 0; i < 7; i++) {
    //   lastWeek.days.push(moment(firstOfLastWeek).add(i, "days"));
    // }

    for (let i = 0; i < 7; i++) {
      thisWeek.days.push(moment(firstOfThisWeek).add(i, "days"));
    }

    for (let i = 0; i < 7; i++) {
      nextWeek.days.push(moment(firstOfNextWeek).add(i, "days"));
    }

    weeks = [/*lastWeek,*/ thisWeek, nextWeek, somedays];

    return (
      <div
        ref={(c) => this.weekScroller = c}
        className={classNames({
          "week-scroller grow flex overflow-auto": true,
        })}
      >
        <WeekContainer
          weeks={weeks}
          startAt={startAt}
          endAt={endAt}
          alsoStartAt={alsoStartAt}
          alsoEndAt={alsoEndAt}
          firebaseRef={this.props.firebaseRef}
          today={this.props.today}
          targetDay={this.props.targetDay}
          focusedDay={this.state.focusedDay}
          saveTodo={this.props.saveTodo}
          focusDay={this.focusDay}
          unfocusDay={this.unfocusDay}
          scrollTo={this.scrollTo}
          connected={this.props.connected}
          anonymous={this.props.anonymous}
        />
      </div>
    );
  }
}

export default Weeks;
