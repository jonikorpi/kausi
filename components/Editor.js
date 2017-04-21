import React, { PureComponent } from "react";
import moment from "moment";
import debounce from "lodash.debounce";
import classNames from "classnames";
import Textarea from "react-textarea-autosize";

export default class Editor extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      text: this.props.text || "",
      lastUpdated: this.props.lastUpdated,
      editing: false,
    };

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
      newText !== this.state.text &&
      (!this.state.lastUpdated ||
        newTimestamp > this.state.lastUpdated ||
        !newTimestamp)
    ) {
      this.setState({
        text: newText,
        lastUpdated: newTimestamp,
      });
    }
  }

  saveTodo = () => {
    if (this.state.lastUpdated && this.state.text !== this.props.text) {
      this.props.saveTodo(
        this.state.text,
        this.state.lastUpdated.valueOf(),
        this.props.day,
        this.props.firebaseKey
      );
    }
  };

  onFocus = () => {
    if (!this.props.loading) {
      this.props.onFocus();
      this.setState({ editing: true });
    }
  };

  onBlur = () => {
    this.setState({ editing: false });
  };

  onChange = event => {
    this.setState(
      {
        text: event.target.value,
        lastUpdated: moment(),
      },
      this.saveTodoHandler
    );
  };

  onKeyDown = event => {
    if (event.keyCode === 27) {
      /*esc*/ this.textarea.blur();
    }
  };

  render() {
    const isEditing = this.state.editing;
    const value = this.props.loading ? "…" : this.state.text || "";

    const props = {
      ref: c => this.textarea = c,
      className: classNames({
        textarea: true,
        first: this.props.first,
        last: this.props.last,
      }),
      value: value,
      onKeyDown: this.onKeyDown,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onChange: this.onChange,
      title: this.props.label,
      readOnly: this.props.loading,
      tabIndex: this.props.autoSize ? -1 : undefined,
      spellCheck: false,
    };

    // Additional entries
    let additionalTexts;

    if (this.props.textCount > 1) {
      let pluralConflictingEntries = `is a conflicting entry`;
      let next = "";

      if (this.props.textCount > 2) {
        pluralConflictingEntries = `are ${this.props.textCount} conflicting entries`;
        next = "next ";
      }

      additionalTexts = `
        WARNING: there ${pluralConflictingEntries} here. If you remove all the text from this ↑ entry, the ${next} conflicting entry should appear and you can decide what to do with it. This can happen with an unstable connection. Sorry for the hassle. :﻿(
      `;
    }

    return (
      <div
        className={classNames({
          textareaContainer: true,
          autoSize: this.props.autoSize,
          noAutoSize: !this.props.autoSize,
        })}
      >
        <style jsx>
          {`
          .textareaContainer {
            position: relative;
            display: flex;
            flex-direction: column;
          }

          .textareaContainer + .textareaContainer {
            border-top: 1px dashed;
          }

          .textareaContainer.noAutoSize {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
          }

          :global(.textarea) {
            background: none;
            border: none;
            outline: none;
            resize: none;
            padding: 0.25rem;
            border-radius: 0.25rem 0 0 0.25rem;
            min-height: 0;
            height: 100%;
            flex-grow: 1;
            -webkit-overflow-scrolling: touch;
            border: solid black;
            border-width: 1px 0;
            overflow: hidden;
            min-height: 1rem;
            box-sizing: content-box;
          }

          :global(.focused) :global(.textarea) {
            overflow: auto;
          }

          :global(.first) {
            border-width: 0 0 1px;
          }

          :global(.last) {
            border-width: 1px 0 0;
          }

          @media (min-width: 40rem) {
            :global(.textarea) {
              padding: 0.5rem;
            }
          }

          .label {
            font-size: 0.625rem;
            line-height: 1rem;
            position: absolute;
            left: 0; top: 0;
            pointer-events: none;
            opacity: 0;
          }

          .label.visible {
            opacity: 0.618;
          }

          :global(.textarea::-webkit-scrollbar) {
            width: .25rem;
            height: .25rem;
            position: absolute;
            left: 0; top: 0;
          }

          :global(.textarea::-webkit-scrollbar-thumb) {
            background: currentcolor;
          }

          :global(.first::-webkit-scrollbar-thumb) {
            border-radius: .25rem .25rem 0 0;
          }

          :global(.last::-webkit-scrollbar-thumb) {
            border-radius: 0 0 .25rem .25rem;
          }

          .additionalTexts {
            font-size: 0.625rem;
            line-height: 0.75rem;
            background: hsl(0, 0%, 91%);
            color: black;
          }
        `}
        </style>

        {this.props.autoSize
          ? <Textarea {...props} maxRows={isEditing ? 13 : 2} />
          : <textarea {...props} />}

        <label
          className={classNames({
            "label padding": true,
            visible: !value && !isEditing && this.props.autoSize,
          })}
        >
          {this.props.label}
        </label>

        {additionalTexts &&
          <div className="additionalTexts padding">
            {additionalTexts}
          </div>}
      </div>
    );
  }
}
