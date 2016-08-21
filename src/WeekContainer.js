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
      somedays: [],
    };

    this.bindFirebase = this.bindFirebase.bind(this);
  }

  componentWillMount() {
    this.bindFirebase(this.props.firebaseRef, this.props.targetDay, this.props.startAt, this.props.endAt, this.props.alsoStartAt, this.props.alsoEndAt);
  }

  componentWillReceiveProps(nextProps) {
    if (
         nextProps.targetDay !== this.props.targetDay
      || nextProps.firebaseRef !== this.props.firebaseRef
      || nextProps.startAt !== this.props.startAt
      || nextProps.endAt !== this.props.endAt
      || nextProps.alsoStartAt !== this.props.alsoStartAt
      || nextProps.alsoEndAt !== this.props.alsoEndAt
    ) {
      console.log("rebinding");
      this.unbind("todos");
      if (this.props.alsoEndAt) {
        this.unbind("somedays");
      }
      this.bindFirebase(nextProps.firebaseRef, nextProps.targetDay, nextProps.startAt, nextProps.endAt, nextProps.alsoStartAt, nextProps.alsoEndAt);
    }
  }

  bindFirebase(firebaseRef, targetDay, startAt, endAt, alsoStartAt, alsoEndAt) {
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

    if (alsoEndAt) {
      this.bindAsArray(
        firebaseRef
          .orderByChild("date")
          .startAt(alsoStartAt)
          .endAt(alsoEndAt),
        "somedays",
        function(error) {
          console.log("Firebase subscription cancelled:")
          console.log(error);
          this.setState({somedays: []})
        }.bind(this)
      );
    }
  }

  render() {
    const weeks = this.props.weeks.map(function(week, i) {
      const isThisWeek = (
        moment(this.props.today).isBetween(week.days[0], week.days[6], null, "[]")
      );

      const isFocusedWeek = (
        this.props.focusedDay && moment(this.props.focusedDay).isBetween(week.days[0], week.days[6], null, "[]")
      );

      const isTargetWeek = (
        moment(this.props.targetDay).isBetween(week.days[0], week.days[6], null, "[]")
      );

      const aDayIsFocused = this.props.focusedDay ? true : false;

      return (
        <Week
          key={week.days[0].valueOf()}
          days={week.days}
          todos={week.somedays ? this.state.somedays : this.state.todos}
          today={this.props.today}
          targetDay={this.props.targetDay}
          focusedDay={this.props.focusedDay}
          aDayIsFocused={aDayIsFocused}
          number={i+1}
          unfocusDay={this.props.unfocusDay}
          focusDay={this.props.focusDay}
          isFocusedWeek={isFocusedWeek}
          scrollTo={this.props.scrollTo}
          saveTodo={this.props.saveTodo}
          somedays={week.somedays ? true : false}
          connected={this.props.connected}
          anonymous={this.props.anonymous}
          className={classNames({
            "week flex even-children child-margins-x-0-5 padding-x padding-0-5 border-2": true,
            "focused-week bg-2": isFocusedWeek || (!aDayIsFocused && isTargetWeek),
            // "unfocused-week": this.props.focusedDay && !isFocusedWeek,
            "this-week": isThisWeek,
          })}
        />
      );
    }.bind(this));

    return (
      <div
        className={classNames({
          "grow flex vertical even-children child-borders-y": true,
        })}
      >
        {weeks}
      </div>
    );
  }
}

reactMixin(WeekContainer.prototype, ReactFire);
export default WeekContainer;
