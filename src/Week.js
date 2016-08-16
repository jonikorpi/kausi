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

    this.bindFirebase = this.bindFirebase.bind(this);
    this.renderDays = this.renderDays.bind(this);
    this.focusDay = this.focusDay.bind(this);
    this.scrollToDay = this.scrollToDay.bind(this);
  }

  componentWillMount() {
    this.bindFirebase(this.props.firebaseRef, this.props.targetDay);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.targetDay !== this.props.targetDay) {
      this.unbind("todos");
      this.unbind("somedays");
      this.bindFirebase(nextProps.firebaseRef, nextProps.targetDay);
      this.setState({focusedDay: null});
    }
  }

  componentDidMount() {
    this.scrollToDay(this.props.targetDay);
  }

  componentDidUpdate() {
    if (this.state.focusedDay) {
      this.scrollToDay(this.state.focusedDay);
    }
  }

  bindFirebase(firebaseRef, targetDay) {
    // console.log("current target is " + moment(targetDay).format("ddd DD MM HH:mm"));
    // console.log("new target is " + moment(this.props.targetDay).format("ddd DD MM HH:mm"));
    // console.log("Start at " + moment(targetDay).startOf("isoweek").subtract(7, "days").format("ddd DD MM HH:mm"));
    // console.log("Stop at " + moment(targetDay).startOf("isoweek").add(14, "days").format("ddd DD MM HH:mm"));

    this.bindAsArray(
      firebaseRef
        .orderByChild("date")
        .startAt(moment(targetDay).startOf("isoweek").subtract(7, "days").valueOf())
        .endAt(moment(targetDay).startOf("isoweek").add(15, "days").valueOf()),
      "todos",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
        this.setState({todos: []})
      }.bind(this)
    );

    this.bindAsArray(
      firebaseRef
        .orderByChild("date")
        .startAt(0)
        .endAt(moment(targetDay).startOf("isoweek").add(7, "days").valueOf()),
      "somedays",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
        this.setState({somedays: []})
      }.bind(this)
    );
  }

  renderDays(week, today, number, someday) {
    return week.map(function(day) {
      let firebaseKey;
      let text = "";

      this.state.todos.forEach(function(todo) {
        if (todo.date === day.valueOf()) {
          firebaseKey = todo[".key"];
          text = todo.text;
        }
      });

      this.state.somedays.forEach(function(todo) {
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
          isTargetDay={day.valueOf() === this.props.targetDay.valueOf()}
          aDayIsFocused={this.state.focusedDay}
          isFocusedWeekDay={this.state.focusedDay && moment(this.state.focusedDay).day() === day.day()}
          isFocusedDay={moment(this.state.focusedDay).isSame(day)}
          focusDay={this.focusDay}
          saveTodo={this.props.saveTodo}
          someday={someday}
        />
      );
    }.bind(this));
  }

  focusDay(day) {
    this.setState({focusedDay: day});
  }

  scrollToDay(day) {
    const scroller = this.weekScroller;
    const textarea = this[day.valueOf()].textarea.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    scroller.scrollLeft += textarea.left - (windowWidth * 0.5) + (textarea.width * 0.5);
  }

  render() {
    const targetDay = this.props.targetDay;
    const firstOfThisWeek = moment(targetDay).startOf("isoweek");
    const firstOfLastWeek = moment(firstOfThisWeek).subtract(7, "days");
    const firstOfNextWeek = moment(firstOfThisWeek).add(7, "days");

    let lastWeek = {number: 1, days: []};
    let thisWeek = {number: 2, days: []};
    let nextWeek = {number: 3, days: []};
    let somedays = {number: 4, days: [], somedays: true}

    for (let i = 0; i < 7; i++) {
      lastWeek.days.push(moment(firstOfLastWeek).add(i, "days"));
    }

    for (let i = 0; i < 7; i++) {
      thisWeek.days.push(moment(firstOfThisWeek).add(i, "days"));
    }

    for (let i = 0; i < 7; i++) {
      nextWeek.days.push(moment(firstOfNextWeek).add(i, "days"));
    }

    for (let i = 0; i < 7; i++) {
      somedays.days.push(moment(0).add(i, "days"));
    }

    const weeks = [lastWeek, thisWeek, nextWeek, somedays].map(function(week) {
      const isFocusedWeek = (
        this.state.focusedDay &&
        moment(this.state.focusedDay).isBetween(week.days[0], week.days[6], null, "[]")
      );

      return (
        <div
          key={week.number}
          className={classNames({
            "week flex even-children padding-x padding-0-25": true,
            "focused-week": isFocusedWeek,
            "unfocused-week": this.state.focusedDay && !isFocusedWeek,
            "this-week": week.number === 2,
            [`bg-${week.number}`]: true,
          })}
        >
          {this.renderDays(week.days, this.props.today, week.number, week.somedays)}
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
