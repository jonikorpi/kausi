import React, { PureComponent } from "react";
import moment from "moment";
import debounce from "lodash.debounce";
import classNames from "classnames";

class Day extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
      text: this.props.text || "",
      lastUpdated: this.props.lastUpdated,
    };

    this.saveTodo = this.saveTodo.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.saveTodoHandler = debounce(
      function() {
        this.saveTodo();
      },
      500,
      { leading: true, trailing: true }
    );
  }

  componentWillReceiveProps(nextProps) {
    const newText = nextProps.text;
    const newTimestamp = nextProps.lastUpdated;

    if (
      newText &&
      newText !== this.state.text &&
      (!this.state.lastUpdated || newTimestamp > this.state.lastUpdated)
    ) {
      this.setState({
        text: newText,
        lastUpdated: newTimestamp,
      });
    }
  }

  saveTodo() {
    if (this.state.lastUpdated && this.state.text !== this.props.text) {
      // this.props.saveTodo(this.state.text, this.state.lastUpdated.valueOf(), this.props.day, this.props.firebaseKey);
    }
  }

  onFocus() {
    this.setState({ editing: true, focused: true });
  }

  onBlur() {
    this.setState({ editing: false, focused: false });
  }

  onChange(event) {
    this.setState(
      {
        text: event.target.value,
        lastUpdated: moment(),
      },
      this.saveTodoHandler
    );
  }

  onKeyDown(event) {
    if (event.keyCode === 27) {
      /*esc*/ this.textarea.blur();
    }
  }

  render() {
    const isToday = this.props.day.isSame(moment().startOf("day"));
    const isWeekend = !this.props.someday &&
      (this.props.day.day() === 0 || this.props.day.day() === 6);
    const isFocused = this.state.focused;

    // Placeholder
    let placeholder;

    if (this.props.anonymous) {
      if (this.props.someday && this.props.day.isSame(moment(0))) {
        placeholder = "You can also type here. Useful for stuff like grocery lists and grandiose plans.";
      } else if (isToday) {
        placeholder = "Try typing something here. Text is auto-saved as you type. \n\nYou are currently using a temporary account. Your entries are saved in this browser only. \n\nTo access your entries in other browsers or devices, sign up. ↘ \n\nSigning up will also make these messages go away.";
      }
    }

    // Additional entries
    let additionalTexts;

    if (this.props.textCount > 1) {
      let pluralConflictingEntries = `is a conflicting entry`;
      let next;

      if (this.props.textCount > 2) {
        pluralConflictingEntries = `are ${this.props.textCount} conflicting entries`;
        next = "next ";
      }

      additionalTexts = (
        <div
          className="color-bright-6 size-0-75 padding-0-75 padding-top-0 margin-0-5 margin-y margin-bottom-0"
        >
          Problem: there
          {" "}
          {pluralConflictingEntries}
          {" "}
          for this day. If you remove this ↑ entry, the
          {" "}
          {next}
          conflicting entry should appear and you can decide what to do with it. This sometimes happens with an unstable connection. Sorry for the hassle. :﻿(
        </div>
      );
    }

    // Date label
    let label, dayLabel, monthLabel;

    if (!this.props.someday) {
      dayLabel = this.props.day.format("ddd DD");
      const todayLabel = isToday ? ", Today" : false;

      if (
        this.props.day.isSame(moment(this.props.day).startOf("isoweek")) ||
        this.props.day.isSame(moment(this.props.day).startOf("month"))
      ) {
        monthLabel = `, ${this.props.day.format("MMM YYYY")}`;
      }

      label = (
        <label
          className={classNames({
            "all-caps padding-0-75 padding-x color-4": true,
            "color-bright-4": isWeekend,
            "color-bright-5": isToday,
          })}
          style={{
            paddingTop: "0.5rem",
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
          day: true,
          focused: isFocused || isToday,
          today: isToday,
        })}
      >
        <style jsx>
          {
            `
          .day {
            flex: 1;
            width: 0;
            flex-direction: vertical;
            padding-top: 1rem;
            position: relative;
            overflow: hidden;
            color: #999;
          }

          .focused {
            flex: none;
            color: inherit;
          }

          .focused,
          .textarea {
            width: 18rem;
            max-width: 66.666vw;
          }

          .label {
            position: absolute;
            left: 0; top: 0;
            font-size: 0.5rem;
            white-space: nowrap;
          }

          .today .label {
            color: yellow;
          }

          .textareaContainer {
            background-color: #222;
            overflow: hidden;
            height: 100%;
          }

          .day:first-child .textareaContainer {
            border-radius: 0.25rem 0 0 0.25rem;
          }

          .day:last-child .textareaContainer {
            border-radius: 0 0.25rem 0.25rem 0;
          }

          .textarea {
            background-color: inherit;
            border: solid black;
            border-width: 1px 0 1px 1px;
            outline: none;
            resize: none;
            padding: 0.25rem;
            border-radius: 0.25rem 0 0 0.25rem;
            min-height: 0;
            height: 100%;
          }
        `
          }
        </style>

        <label className="label" htmlFor={this.props.day.valueOf()}>
          {this.props.day.format(isFocused ? "DD ddd MMM YYYY" : "DD")}
        </label>

        <div className="textareaContainer">
          <textarea
            id={this.props.day.valueOf()}
            ref={c => this.textarea = c}
            className="textarea"
            value={this.state.text}
            onKeyDown={this.onKeyDown}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={this.onChange}
            placeholder={placeholder}
            readOnly={this.props.loading}
          />
        </div>

        {additionalTexts}
      </div>
    );
  }
}

export default Day;
