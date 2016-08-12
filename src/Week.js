import React, { Component } from "react";
import moment from "moment";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";
import classNames from "classnames";

import Day from "./Day";

class Week extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedDay: null,
      todos: [],
    };

    this.renderDays = this.renderDays.bind(this);
    this.focusDay = this.focusDay.bind(this);
    this.scrollToDay = this.scrollToDay.bind(this);
  }

  componentWillMount() {
    this.bindAsArray(
      this.props.firebaseRef
        .orderByChild("date")
        .startAt(moment(this.props.targetDate).startOf("week").subtract(7, "days").valueOf())
        .endAt(moment(this.props.targetDate).startOf("week").add(15, "days").valueOf()),
      "todos",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
      }
    );
  }

  componentDidMount() {
    this.scrollToDay(this.props.targetDate);
  }

  renderDays(week, today, number) {
    return week.map(function(day) {
      let firebaseKey;
      let text = "";

      this.state.todos.forEach(function(todo) {
        if (todo.date === day.valueOf()) {
          firebaseKey = todo[".key"];
          text = todo.text;
        }
      });

      return (
        <Day
          ref={(c) => this[day.valueOf()] = c}
          key={day.valueOf()}
          day={day}
          firebaseKey={firebaseKey}
          text={text}
          today={today}
          colorNumber={number}
          isFirstWeek={number === 1}
          isToday={day.valueOf() === this.props.today.valueOf()}
          isTargetDate={day.valueOf() === this.props.targetDate.valueOf()}
          aDayIsFocused={this.state.focusedDay}
          isFocusedWeekDay={this.state.focusedDay && moment(this.state.focusedDay).day() === day.day()}
          isFocusedDay={moment(this.state.focusedDay).isSame(day)}
          focusDay={this.focusDay}
          saveTodo={this.props.saveTodo}
        />
      );
    }.bind(this));
  }

  focusDay(day) {
    this.setState({focusedDay: day});
    if (day) {
      this.scrollToDay(day);
    }
  }

  scrollToDay(day) {
    const scroller = this.weekScroller;
    const textarea = this[day.valueOf()].textarea.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    scroller.scrollLeft += textarea.left - (windowWidth * 0.5) + (textarea.width * 0.5);
  }

  render() {
    const targetDate = this.props.targetDate;
    const firstOfThisWeek = moment(targetDate).startOf("isoweek");
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

    const weeks = [lastWeek, thisWeek, nextWeek].map(function(week) {
      const isFocusedWeek = (
        this.state.focusedDay &&
        moment(this.state.focusedDay).isBetween(week.days[0], week.days[6], null, "[]")
      );

      return (
        <div
          key={week.number}
          className={classNames({
            "week flex even-children": true,
            "focused-week": isFocusedWeek,
            "unfocused-week": this.state.focusedDay && !isFocusedWeek,
            "this-week": week.number === 2,
          })}
        >
          {this.renderDays(week.days, this.props.today, week.number)}
        </div>
      );
    }.bind(this));

    return (
      <div
        ref={(c) => this.weekScroller = c}
        className="week-scroller grow flex vertical even-children overflow-auto"
      >
        {weeks}
      </div>
    );
  }
}

reactMixin(Week.prototype, ReactFire);
export default Week;
