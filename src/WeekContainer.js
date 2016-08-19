import React, { Component } from "react";
import moment from "moment";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";
import classNames from "classnames";

import Week from "./Week";

class WeekContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [],
    };

    this.bindFirebase = this.bindFirebase.bind(this);
  }

  componentWillMount() {
    this.bindFirebase(this.props.firebaseRef, this.props.targetDay, this.props.startAt, this.props.endAt);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.targetDay !== this.props.targetDay
      || nextProps.startAt !== this.props.startAt
      || nextProps.endAt !== this.props.endAt
    ) {
      console.log("rebinding");
      this.unbind("todos");
      this.bindFirebase(nextProps.firebaseRef, nextProps.targetDay, nextProps.startAt, nextProps.endAt);
    }
  }

  bindFirebase(firebaseRef, targetDay, startAt, endAt) {
    // console.log("current target is " + moment(targetDay).format("ddd DD MM HH:mm"));
    // console.log("new target is " + moment(this.props.targetDay).format("ddd DD MM HH:mm"));
    // console.log("Start at " + moment(targetDay).startOf("isoweek").subtract(7, "days").format("ddd DD MM HH:mm"));
    // console.log("Stop at " + moment(targetDay).startOf("isoweek").add(14, "days").format("ddd DD MM HH:mm"));

    this.bindAsArray(
      firebaseRef
        .orderByChild("date")
        .startAt(startAt)
        .endAt(endAt),
      "todos",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
        this.setState({todos: []})
      }.bind(this)
    );
  }

  render() {
    const weeks = this.props.weeks.map(function(week) {
      const isFocusedWeek = (
        this.state.focusedDay &&
        moment(this.state.focusedDay).isBetween(week.days[0], week.days[6], null, "[]")
      );

      return (
        <Week
          key={week.number}
          days={week.days}
          todos={this.state.todos}
          today={this.props.today}
          targetDay={this.props.targetDay}
          focusedDay={this.props.focusedDay}
          number={week.number}
          unfocusDay={this.props.unfocusDay}
          focusDay={this.props.focusDay}
          scrollTo={this.props.scrollTo}
          saveTodo={this.props.saveTodo}
          someday={this.props.someday}
          className={classNames({
            "week flex even-children padding-x padding-0-25": true,
            "focused-week": isFocusedWeek,
            "unfocused-week": this.state.focusedDay && !isFocusedWeek,
            "this-week": week.number === 2,
            [`bg-${week.number}`]: true,
          })}
        />
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

reactMixin(WeekContainer.prototype, ReactFire);
export default WeekContainer;
