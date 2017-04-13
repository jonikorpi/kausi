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
    this.props.onFocus();
  };

  onBlur = () => {
    this.props.onBlur();
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
    const isFocused = this.props.focused;
    const props = {
      id: this.props.day.valueOf(),
      ref: c => this.textarea = c,
      className: "textarea",
      value: this.state.text || "",
      onKeyDown: this.onKeyDown,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onChange: this.onChange,
      placeholder: this.props.placeholder,
      readOnly: this.props.loading,
    };

    return (
      <div
        className={
          `textareaContainer ${this.props.autoSize ? "autoSize" : "noAutoSize"}`
        }
      >
        <style jsx>
          {
            `
          .textareaContainer {
            position: relative;
          }

          .textareaContainer + .textareaContainer {
            border-top: 1px dashed black;
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
          }
        `
          }
        </style>

        {this.props.autoSize
          ? <Textarea {...props} maxRows={5} />
          : <textarea {...props} />}

        {this.props.additionalTexts}
      </div>
    );
  }
}
