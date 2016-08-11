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
          key={day.valueOf()}
          day={day}
          firebaseKey={firebaseKey}
          text={text}
          today={today}
          colorNumber={number}
          isFirstWeek={number === 1}
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
      <div className="week-scroller grow flex vertical even-children overflow-auto enter-fade animation-delay-1">
        {weeks}
      </div>
    );
  }
}

reactMixin(Week.prototype, ReactFire);
export default Week;
