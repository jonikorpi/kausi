import React, { Component } from "react";
import moment from "moment";
import classNames from "classnames";
import debounce from "lodash.debounce";
import shallowCompare from "react-addons-shallow-compare";
import firebase from "firebase";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";

class Day extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firebase: [],
      editing: false,
      text: "",
    };

    this.bindFirebase = this.bindFirebase.bind(this);

    //
    // this.saveTodo = this.saveTodo.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    // this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    //
    // this.saveTodoHandler = debounce(function () {
    //   this.saveTodo()
    // }, 500);
  }

  componentDidMount() {
    if (this.props.uid) {
      this.bindFirebase(this.props.uid);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.uid !== this.props.uid) {
      this.unbind("firebase");
      this.bindFirebase(nextProps.uid);
    }
  }

  bindFirebase(uid) {
    this.bindAsArray(
      firebase.database().ref(uid).orderByChild("date").equalTo(this.props.day.valueOf()),
      "firebase",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
        this.setState({firebase: {}})
      }.bind(this)
    );
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.text !== this.state.text) {
  //     this.setState({
  //       text: nextProps.text
  //     });
  //   }
  // }
  //
  // saveTodo() {
  //   this.props.saveTodo(this.props.firebaseKey, this.props.day.valueOf(), this.state.text);
  // }
  //
  onFocus() {
    this.setState({editing: true});
  }

  onBlur() {
    this.setState({
      editing: false
    });
    // this.saveTodo();
  }
  //
  // onChange(event) {
  //   this.setState({text: event.target.value})
  //   this.saveTodoHandler();
  // }
  //
  onKeyDown(event) {
    if (event.keyCode === 27 /*esc*/) {
      this.textarea.blur();
    }
  }
  //
  // render() {
  //   const colorNumber = this.props.isInFocusedWeek ? 2 : 1;
  //
  //   const dayClasses = classNames({
  //     "day flex vertical padding-0-5 padding-top min-day-width child-margins-y-0-25": true,
  //     "border-color-2 border border-y border-bottom-0": !this.props.isFirstWeek,
  //     "bg-2": this.props.isInFocusedWeek,
  //     [`color-${colorNumber+4}`]: !this.props.aDayIsFocused ||  this.props.isFocusedDay,
  //     [`color-${colorNumber+3}`]:  this.props.aDayIsFocused && !this.props.isFocusedDay,
  //   });
  //
  //   let dayLabel, monthLabel;
  //   const todayLabel = this.props.isToday? ", Today" : false
  //
  //   if (this.props.someday) {
  //     dayLabel = `Someday ${this.props.day.format("D")}`;
  //   }
  //   else {
  //     dayLabel = this.props.day.format("ddd DD");
  //
  //     if (
  //         (
  //           this.props.weekNumber === 1 &&
  //           this.props.day.isSame(moment(this.props.day).startOf("isoweek"))
  //         ) ||
  //         this.props.day.isSame(moment(this.props.day).startOf("month"))
  //     ) {
  //       monthLabel = `, ${this.props.day.format("MMM YYYY")}`;
  //     }
  //   }
  //

  render() {
    const isToday = this.props.day.isSame(moment().startOf("day"));
    const isWeekend = !this.props.someday && (this.props.day.day() === 0 || this.props.day.day() === 6);
    const isEditing = this.state.editing;

    // Text value
    let text;

    if (this.state.firebase[0] && this.state.firebase[0].text) {
      text = this.state.firebase[0].text;
    }

    // Placeholder
    let placeholder;

    if (this.props.anonymous) {
      if ( this.props.someday && this.props.day.isSame(moment(0)) ) {
        placeholder = "You can also type here. This row is not tied to any week. Useful for stuff like grocery lists and grandiose plans.";
      }
      else if (isToday) {
        placeholder = "Try typing something here. Text is auto-saved as you type.\n\nYou are currently using a temporary account. Your entries are saved in this browser only.\n\nTo access your entries in other browsers or devices, SIGN UP from the top menu.\n\nSigning up will also make these messages go away.";
      }
    }

    // Additional entries
    let additionalTexts;

    if (this.state.firebase.length > 1) {
      let pluralConflictingEntries = `is a conflicting entry`;
      let next;

      if (this.state.firebase.length > 2) {
        pluralConflictingEntries = `are ${this.props.additionalTexts.length} conflicting entries`;
        next = "next ";
      }

      additionalTexts = (
        <div className="color-bright-6 size-0-75 padding-0-75 padding-top-0 margin-0-5 margin-y margin-bottom-0">
          Problem: there {pluralConflictingEntries} for this day. If you remove this &uarr; entry, the {next}conflicting entry will appear and you can decide what to do with it. This sometimes happens with an unstable connection. Sorry for the hassle. :&#65279;(
        </div>
      );
    }

    // Date label
    let label, dayLabel, monthLabel;

    if (!this.props.someday) {
      dayLabel = this.props.day.format("ddd DD");
      const todayLabel = isToday ? ", Today" : false

      if (
          (
            this.props.weekNumber === 1 &&
            this.props.day.isSame(moment(this.props.day).startOf("isoweek"))
          ) ||
          this.props.day.isSame(moment(this.props.day).startOf("month"))
      ) {
        monthLabel = `, ${this.props.day.format("MMM YYYY")}`;
      }

      label = (
        <label
          className={classNames({
            "all-caps padding-0-75 padding-bottom-0": true,
            "color-4": !isToday,
            "color-bright-4": isWeekend,
            "color-bright-5": isToday,
            "color-bright-6": isEditing,
            //           [`color-${colorNumber+3}`]: (this.props.aDayIsFocused && this.props.isFocusedDay) || !this.props.aDayIsFocused,
            //           [`color-${colorNumber+2}`]:  this.props.aDayIsFocused,
            //           [`color-bright-${colorNumber+4}`]: this.props.isToday && (!this.props.aDayIsFocused || (this.props.aDayIsFocused && this.props.isFocusedDay)),
            //           [`color-bright-${colorNumber+3}`]: this.props.isToday && !this.props.aDayIsFocused,
          })}
          style={{
            paddingBottom: "0.5rem",
          }}
          htmlFor={this.props.day.valueOf()}
        >
          {dayLabel}{monthLabel}{todayLabel}
        </label>
      );
    }

    return (
      <div
        className={classNames({
          "flex vertical day": true,
          "bg-1": !this.props.someday,
          "bg-2 border border-x border-right-0 border-color-1":  this.props.someday,
          // "bg-bright-2": !isWeekend,
          "color-6": isEditing,
          "color-5": !isEditing,
          // [`color-${colorNumber+4}`]: !this.props.aDayIsFocused ||  this.props.isFocusedDay,
          // [`color-${colorNumber+3}`]:  this.props.aDayIsFocused && !this.props.isFocusedDay,
        })}
        style={{
          minWidth: "12rem",
          width: "12rem",
        }}
      >
        {label}

        <textarea
          id={this.props.day.valueOf()}
          ref={(c) => this.textarea = c}
          className={classNames({
            "padding-0-75 grow width-100 scrollbar-3": true,
            "padding-top-0": !this.props.someday,
          })}
          value={text}
          onKeyDown={this.onKeyDown}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          //         onChange={this.onChange}
          //         value={this.state.text}
          //         readOnly={!this.props.haveConnectedOnce}
          placeholder={placeholder}
          //         autoFocus={this.props.isToday}
        />

        {additionalTexts}
      </div>
    );
  }
}

reactMixin(Day.prototype, ReactFire);
export default Day;
