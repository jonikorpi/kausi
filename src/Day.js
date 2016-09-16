import React, { Component } from "react";
import moment from "moment";
import classNames from "classnames";
import debounce from "lodash.debounce";
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
      lastUpdated: null,
    };

    this.bindFirebase = this.bindFirebase.bind(this);
    this.saveTodo = this.saveTodo.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.saveTodoHandler = debounce(function () {
      this.saveTodo()
    }, 500);
  }

  componentDidMount() {
    if (this.props.uid) {
      this.bindFirebase(this.props.uid);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.uid !== this.props.uid) {
      if (this.firebaseRefs.firebase) {
        this.unbind("firebase");
      }
      if (nextProps.uid) {
        this.bindFirebase(nextProps.uid);
      }
    }
  }

  componentDidUpdate() {
    const newText = this.state.firebase[0] ? this.state.firebase[0].text : null;
    const newTimestamp = this.state.firebase[0] ? this.state.firebase[0].lastUpdated : 0;

    if (
      (newText && newText !== this.state.text)
      && (!this.state.lastUpdated || newTimestamp > this.state.lastUpdated)
    ) {
      this.setState({ text: newText });
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

  saveTodo() {
    if (this.props.uid && this.state.lastUpdated) {
      let firebaseRef = firebase.database().ref(this.props.uid);
      let key = this.state.firebase[0] ? this.state.firebase[0][".key"] : null;
      const text = this.state.text;
      const lastUpdated = this.state.lastUpdated.valueOf();
      const day = this.props.day.valueOf();

      if (!key && text) {
        key = firebaseRef.push().key;
      }

      if (key) {
        if (text) {
          firebaseRef.update({
            [key]: {
              date: day,
              text: text,
              lastUpdated: lastUpdated,
            }
          });
        }
        else {
          firebaseRef.update({
            [key]: null
          });
        }
      }
    }
  }

  onFocus() {
    this.setState({editing: true});
    this.props.setActiveTimeline();
  }

  onBlur() {
    this.setState({editing: false});
    this.saveTodo();
  }

  onChange(event) {
    this.setState({
      text: event.target.value,
      lastUpdated: moment(),
    });
    this.saveTodoHandler();
  }

  onKeyDown(event) {
    if (event.keyCode === 27 /*esc*/) {
      this.textarea.blur();
    }
  }

  render() {
    const isToday = this.props.day.isSame(moment().startOf("day"));
    const isWeekend = !this.props.someday && (this.props.day.day() === 0 || this.props.day.day() === 6);
    const isEditing = this.state.editing;

    // Placeholder
    let placeholder;

    if (this.props.anonymous) {
      if ( this.props.someday && this.props.day.isSame(moment(0)) ) {
        placeholder = "You can also type here. Useful for stuff like grocery lists and grandiose plans.";
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
             this.props.day.isSame(moment(this.props.day).startOf("isoweek"))
          || this.props.day.isSame(moment(this.props.day).startOf("month"))
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
          "color-6": isEditing,
          "color-5": !isEditing,
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
          value={this.state.text}
          onKeyDown={this.onKeyDown}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.onChange}
          placeholder={placeholder}
        />

        {additionalTexts}
      </div>
    );
  }
}

reactMixin(Day.prototype, ReactFire);
export default Day;
