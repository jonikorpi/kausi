import React, { Component } from "react";
import moment from "moment";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";
import classNames from "classnames";

import WeekContainer from "./WeekContainer";

class Weeks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedDay: null,
      todos: [],
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
    let weeks, startAt, endAt;

    if (this.props.someday) {
      startAt = 0;
      endAt = moment(this.props.targetDay).startOf("isoweek").add(7, "days").valueOf();

      let somedays = {number: 1, days: [], somedays: true}

      for (let i = 0; i < 7; i++) {
        somedays.days.push(moment(0).add(i, "days"));
      }

      weeks = [somedays];
    }
    else {
      startAt = moment(this.props.targetDay).startOf("isoweek").subtract(7, "days").valueOf();
      endAt = moment(this.props.targetDay).startOf("isoweek").add(15, "days").valueOf();

      const firstOfThisWeek = moment(this.props.targetDay).startOf("isoweek");
      const firstOfLastWeek = moment(firstOfThisWeek).subtract(7, "days");
      const firstOfNextWeek = moment(firstOfThisWeek).add(7, "days");

      let lastWeek = {number: 1, days: []};
      let thisWeek = {number: 2, days: []};
      let nextWeek = {number: 3, days: []};

      for (let i = 0; i < 7; i++) {
        lastWeek.days.push(moment(firstOfLastWeek).add(i, "days"));
      }

      for (let i = 0; i < 7; i++) {
        thisWeek.days.push(moment(firstOfThisWeek).add(i, "days"));
      }

      for (let i = 0; i < 7; i++) {
        nextWeek.days.push(moment(firstOfNextWeek).add(i, "days"));
      }

      weeks = [lastWeek, thisWeek, nextWeek];
    }

    return (
      <WeekContainer
        weeks={weeks}
        startAt={startAt}
        endAt={endAt}
        firebaseRef={this.props.firebaseRef}
        today={this.props.today}
        targetDay={this.props.targetDay}
        focusedDay={this.state.focusedDay}
        saveTodo={this.props.saveTodo}
        focusDay={this.focusDay}
        unfocusDay={this.unfocusDay}
        scrollTo={this.scrollTo}
        someday={this.props.someday}
      />
    );
  }
}

reactMixin(Weeks.prototype, ReactFire);
export default Weeks;
