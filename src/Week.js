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

  renderDays(week, today, colorNumber, isFirstWeek) {
    return week.map(function(day) {
      return (
        <Day
          key={day.valueOf()}
          day={day}
          today={today}
          colorNumber={colorNumber}
          isFirstweek={isFirstWeek}
          aDayIsFocused={this.state.focusedDay}
          isFocusedDay={moment(this.state.focusedDay).isSame(day)}
          focusDay={this.focusDay}
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

    let lastWeek = {colorNumber: 1, days: []};
    let thisWeek = {colorNumber: 2, days: []};
    let nextWeek = {colorNumber: 3, days: []};

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
          key={week.colorNumber}
          className={classNames({
            "week flex even-children": true,
            ["bg-" + week.colorNumber]: true,
            "focused-week": isFocusedWeek,
            "unfocused-week": this.state.focusedDay && !isFocusedWeek,
          })}
        >
          {this.renderDays(week.days, today, week.colorNumber+2, true)}
        </div>
      );
    }.bind(this));

    return (
      <div className="grow flex">
        <div className="grow flex vertical even-children">
          {weeks}
        </div>
      </div>
    );
  }
}

export default Week;
