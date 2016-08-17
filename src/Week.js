import React, { Component } from "react";
import moment from "moment";

import Day from "./Day";

class Week extends Component {
  render() {
    const days = this.props.days.map(function(day) {
      let firebaseKey;
      let text = "";

      this.props.todos.forEach(function(todo) {
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
          today={this.props.today}
          colorNumber={this.props.number}
          isFirstWeek={this.props.number === 1}
          isToday={day.valueOf() === this.props.today.valueOf()}
          isTargetDay={day.valueOf() === this.props.targetDay.valueOf()}
          aDayIsFocused={this.props.focusedDay ? true : false}
          isFocusedWeekDay={this.props.focusedDay && moment(this.props.focusedDay).day() === day.day()}
          isFocusedDay={moment(this.props.focusedDay).isSame(day)}
          focusDay={this.props.focusDay}
          unfocusDay={this.props.unfocusDay}
          saveTodo={this.props.saveTodo}
          someday={this.props.somedays}
        />
      );
    }.bind(this));

    return (
      <div className={this.props.className}>
        {days}
      </div>
    );
  }
}

export default Week;
