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
    // this.onFocus = this.onFocus.bind(this);
    // this.onBlur = this.onBlur.bind(this);
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
  // onFocus() {
  //   this.setState({editing: true});
  //   this.props.focusDay(this.props.day, this.textarea);
  // }
  //
  // onBlur() {
  //   this.setState({
  //     editing: false
  //   });
  //   this.props.unfocusDay();
  //   this.saveTodo();
  // }
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
  //   let placeholder;
  //   if (this.props.anonymous && this.props.targetIsToday) {
  //     if (this.props.someday && +this.props.day.format("D") === 1) {
  //       placeholder = "This row is not tied to any week and will always stay put. Useful for stuff like grocery lists and grandiose plans.";
  //     }
  //     // else if (this.props.weekNumber === 1 && +this.props.day.format("d") === 1) {
  //     //   placeholder = "This row is always last week."
  //     // }
  //     else if (this.props.weekNumber === 1) {
  //       if (+this.props.day.format("d") === 1) {
  //         placeholder = "This row is always the current week."
  //       }
  //       else if (+this.props.day.format("d") === 2) {
  //         placeholder = "Try typing something here. Text is auto-saved as you type.";
  //       }
  //       else if (+this.props.day.format("d") === 3) {
  //         placeholder = "You are currently using a temporary account. Your entries are saved in this browser only.";
  //       }
  //       else if (+this.props.day.format("d") === 4) {
  //         placeholder = "To access your entries in other browsers or devices, SIGN UP from the top menu. \n\nSigning up will also make these messages go away.";
  //       }
  //       else if (+this.props.day.format("d") === 5) {
  //         placeholder = "Protips:\n\nWhen using this app for todos I find it handy to mark completed tasks with an x. Like this ->\n\nTo move todos from one day to another, just cut and paste.";
  //       }
  //       else if (+this.props.day.format("d") === 6) {
  //         placeholder = "x 9:00 Dentist\n12:00 Lunch\n18:00 Play video games";
  //       }
  //     }
  //     else if (this.props.weekNumber === 2) {
  //       if (+this.props.day.format("d") === 1) {
  //         placeholder = "This row is always next week."
  //       }
  //       else if (+this.props.day.format("d") === 2) {
  //         placeholder = "To access weeks further in the future or in the past, ZOOM OUT from the top menu.";
  //       }
  //     }
  //   }
  //
  //   let additionalTexts;
  //   if (this.props.additionalTexts.length > 0) {
  //     let pluralConflictingEntries = `is a conflicting entry`;
  //     let next;
  //
  //     if (this.props.additionalTexts.length > 1) {
  //       pluralConflictingEntries = `are ${this.props.additionalTexts.length} conflicting entries`;
  //       next = "next ";
  //     }
  //
  //     additionalTexts = (
  //       <div className="color-bright-5 size-0-75 padding-0-5 padding-top-0">
  //         Problem: there {pluralConflictingEntries} for this day. If you remove this &uarr; entry, the {next}conflicting entry will appear and you can decide what to do with it. This sometimes happens with an unstable connection. Sorry for the hassle. :&#65279;(
  //       </div>
  //     );
  //   }
  //
  //   return (
  //     <div className={dayClasses}>
  //       <label
  //         htmlFor={this.props.day.valueOf()}
  //         className={classNames({
  //           "all-caps padding-0-5 padding-top-0 padding-bottom-0": true,
  //           [`color-${colorNumber+3}`]: (this.props.aDayIsFocused && this.props.isFocusedDay) || !this.props.aDayIsFocused,
  //           [`color-${colorNumber+2}`]:  this.props.aDayIsFocused,
  //           [`color-bright-${colorNumber+4}`]: this.props.isToday && (!this.props.aDayIsFocused || (this.props.aDayIsFocused && this.props.isFocusedDay)),
  //           [`color-bright-${colorNumber+3}`]: this.props.isToday && !this.props.aDayIsFocused,
  //         })}
  //       >
  //         {dayLabel}{monthLabel}{todayLabel}
  //       </label>
  //
  //       <textarea
  //         id={this.props.day.valueOf()}
  //         ref={(c) => this.textarea = c}
  //         className={classNames({
  //           "padding-0-5 padding-top-0 margin-bottom margin-0-25 grow width-100": true,
  //         })}
  //         onFocus={this.onFocus}
  //         onBlur={this.onBlur}
  //         onChange={this.onChange}
  //         value={this.state.text}
  //         onKeyDown={this.onKeyDown}
  //         readOnly={!this.props.haveConnectedOnce}
  //         placeholder={placeholder}
  //         autoFocus={this.props.isToday}
  //       />
  //
  //       {additionalTexts}
  //     </div>
  //   );
  // }

  render() {
    let text;

    if (this.state.firebase[0] && this.state.firebase[0].text) {
      text = this.state.firebase[0].text;
    }

    let dayLabel, monthLabel;
    const todayLabel = this.props.isToday ? ", Today" : false

    if (this.props.someday) {
      dayLabel = `Someday ${this.props.day.format("D")}`;
    }
    else {
      dayLabel = this.props.day.format("ddd DD");

      if (
          (
            this.props.weekNumber === 1 &&
            this.props.day.isSame(moment(this.props.day).startOf("isoweek"))
          ) ||
          this.props.day.isSame(moment(this.props.day).startOf("month"))
      ) {
        monthLabel = `, ${this.props.day.format("MMM YYYY")}`;
      }
    }

    return (
      <div
        className={classNames({
          "day flex vertical padding-0-5 padding-top min-day-width child-margins-y-0-25": true,
          // "border-color-2 border border-y border-bottom-0": !this.props.isFirstWeek,
          // "bg-2": this.props.isInFocusedWeek,
          // [`color-${colorNumber+4}`]: !this.props.aDayIsFocused ||  this.props.isFocusedDay,
          // [`color-${colorNumber+3}`]:  this.props.aDayIsFocused && !this.props.isFocusedDay,
        })}
        style={{
          width: "12rem",
        }}
      >
        <label
          className={classNames({
            "color-bright-5 all-caps": true
          })}
          htmlFor={this.props.day.valueOf()}
        >
          {dayLabel}{monthLabel}{todayLabel}
        </label>

        <textarea
          id={this.props.day.valueOf()}
          ref={(c) => this.textarea = c}
          className={classNames({
            "padding-0-5 padding-top-0 margin-bottom margin-0-25 grow width-100": true,
          })}
          placeholder={text}
          onKeyDown={this.onKeyDown}
          //         onFocus={this.onFocus}
          //         onBlur={this.onBlur}
          //         onChange={this.onChange}
          //         value={this.state.text}
          //         readOnly={!this.props.haveConnectedOnce}
          //         placeholder={placeholder}
          //         autoFocus={this.props.isToday}
        />
      </div>
    );
  }
}

reactMixin(Day.prototype, ReactFire);
export default Day;
