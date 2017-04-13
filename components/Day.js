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

    this.saveTodoHandler = debounce(function () {
      this.saveTodo()
    }, 500, { leading: true, trailing: true });
  }

  componentWillReceiveProps(nextProps) {
    const newText = nextProps.text;
    const newTimestamp = nextProps.lastUpdated;

    if (
      (newText && newText !== this.state.text)
      && (!this.state.lastUpdated || newTimestamp > this.state.lastUpdated)
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
    this.setState({ editing: true });
    this.props.setActiveTimeline(this.props.index);
  }

  onBlur() {
    this.setState({ editing: false });
  }

  onChange(event) {
    this.setState({
      text: event.target.value,
      lastUpdated: moment(),
    }, this.saveTodoHandler);
  }

  onKeyDown(event) {
    if (event.keyCode === 27 /*esc*/) {
      this.textarea.blur();
    }
  }

  render() {
    const isToday = this.props.day.isSame(moment().startOf("day"));
    const isWeekend = !this.props.someday && (this.props.day.day() === 0 || this.props.day.day() === 6);
    const isFocused = this.state.isFocused;

    // Placeholder
    let placeholder;

    if (this.props.anonymous) {
      if (this.props.someday && this.props.day.isSame(moment(0))) {
        placeholder = "You can also type here. Useful for stuff like grocery lists and grandiose plans.";
      }
      else if (isToday) {
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
        <div className="color-bright-6 size-0-75 padding-0-75 padding-top-0 margin-0-5 margin-y margin-bottom-0">
          Problem: there {pluralConflictingEntries} for this day. If you remove this &uarr; entry, the {next}conflicting entry should appear and you can decide what to do with it. This sometimes happens with an unstable connection. Sorry for the hassle. :&#65279;(
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
            "all-caps padding-0-75 padding-x color-4": true,
            "color-bright-4": isWeekend,
            "color-bright-5": isToday,
            "color-bright-6": isEditing,
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
          "day": true,
          "isFocused": isFocused,
          "isToday": this.props.isToday,
        })}
      >
        <label className="label" htmlFor={this.props.day.valueOf()}>
          {this.props.day.format(isFocused ? "DD ddd MMM YYYY" : "DD")}
        </label>

        {
          this.props.loading
            ? (
              <div className="padding-0-75">
                <div className="spin border border-0-125 border-color-4 dashed round height-0-75 width-0-75"></div>
              </div>
            )
            : (
              <textarea
                id={this.props.day.valueOf()}
                ref={(c) => this.textarea = c}
                tabIndex={this.props.tabbingEnabled ? 1 : -1}
                className="textarea"
                style={{
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                }}
                value={this.state.text}
                onKeyDown={this.onKeyDown}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onChange={this.onChange}
                placeholder={placeholder}
              />
            )
        }

        {additionalTexts}
      </div>
    );
  }
}

export default Day;
