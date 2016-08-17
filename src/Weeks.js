import React, { Component } from "react";
import moment from "moment";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";
import classNames from "classnames";

import Week from "./Week";

class Weeks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedDay: null,
      todos: [],
    };

    this.bindFirebase = this.bindFirebase.bind(this);
    this.focusDay = this.focusDay.bind(this);
    this.unfocusDay = this.unfocusDay.bind(this);
  }

  componentWillMount() {
    this.bindFirebase(this.props.firebaseRef, this.props.targetDay);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.targetDay !== this.props.targetDay) {
      console.log("rebinding");
      this.unbind("todos");
      this.unbind("somedays");
      this.bindFirebase(nextProps.firebaseRef, nextProps.targetDay);
      this.setState({focusedDay: null});
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
        // .startAt(moment(targetDay).startOf("isoweek").subtract(7, "days").valueOf())
        .startAt(moment(targetDay).startOf("isoweek").valueOf())
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
    const targetDay = this.props.targetDay;
    const firstOfThisWeek = moment(targetDay).startOf("isoweek");
    const firstOfLastWeek = moment(firstOfThisWeek).subtract(7, "days");
    const firstOfNextWeek = moment(firstOfThisWeek).add(7, "days");

    // let lastWeek = {number: 1, days: []};
    let thisWeek = {number: 1, days: []};
    let nextWeek = {number: 2, days: []};
    let somedays = {number: 3, days: [], somedays: true}

    // for (let i = 0; i < 7; i++) {
    //   lastWeek.days.push(moment(firstOfLastWeek).add(i, "days"));
    // }

    for (let i = 0; i < 7; i++) {
      thisWeek.days.push(moment(firstOfThisWeek).add(i, "days"));
    }

    for (let i = 0; i < 7; i++) {
      nextWeek.days.push(moment(firstOfNextWeek).add(i, "days"));
    }

    for (let i = 0; i < 7; i++) {
      somedays.days.push(moment(0).add(i, "days"));
    }

    const weeks = [/*lastWeek,*/ thisWeek, nextWeek, somedays].map(function(week) {
      const isFocusedWeek = (
        this.state.focusedDay &&
        moment(this.state.focusedDay).isBetween(week.days[0], week.days[6], null, "[]")
      );

      let todoSource = this.state.todos;

      if (week.somedays) {
        todoSource = this.state.somedays;
      }

      return (
        <Week
          key={week.number}
          days={week.days}
          todos={todoSource}
          today={this.props.today}
          targetDay={this.props.targetDay}
          focusedDay={this.state.focusedDay}
          number={week.number}
          somedays={week.somedays}
          focusDay={this.focusDay}
          scrollTo={this.scrollTo}
          unfocusDay={this.unfocusDay}
          saveTodo={this.props.saveTodo}
          className={classNames({
            "week flex even-children padding-x padding-0-25": true,
            "focused-week": isFocusedWeek,
            "unfocused-week": this.state.focusedDay && !isFocusedWeek,
            "this-week": week.number === 1,
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

reactMixin(Weeks.prototype, ReactFire);
export default Weeks;
