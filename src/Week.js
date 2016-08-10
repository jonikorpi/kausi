import React, { Component } from "react";
import moment from "moment";
import classNames from "classnames";

import Day from "./Day";

class Week extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedDay: null
    };

    this.renderDays = this.renderDays.bind(this);
    this.focusDay = this.focusDay.bind(this);
  }

  renderDays(week, today, number, isFirstWeek) {
    return week.map(function(day) {
      let firebaseKey;
      let text = "";

      if (this.props.todos) {
        this.props.todos.forEach(function(todo) {
          if (todo.date === day.valueOf()) {
            firebaseKey = todo[".key"];
            text = todo.text;
          }
        });
      }

      return (
        <Day
          key={day.valueOf()}
          day={day}
          firebaseKey={firebaseKey}
          text={text}
          today={today}
          colorNumber={number}
          isFirstweek={isFirstWeek}
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
    const today = this.props.date;
    const firstOfThisWeek = moment(today).startOf("isoweek");
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
          })}
        >
          {this.renderDays(week.days, today, week.number, true)}
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

export default Week;
