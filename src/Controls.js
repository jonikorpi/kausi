import React, { Component } from 'react';
import classNames from "classnames";

import Button from "./Button";

class Controls extends Component {

  constructor(props) {
    super(props);

    this.state = {
      haveConnectedOnce: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.connected) {
      this.setState({haveConnectedOnce: true})
    }
  }

  render() {
    let status, buttons;

    if (!this.props.connected) {
      if (this.state.haveConnectedOnce) {
        status = (
          <div className="padding-0-5 color-bright-5 enter-from-above">
            <p>OFFLINE: text entry disabled.</p>
          </div>
        );
      }
      else {
        status = (
          <div className="padding-0-5 color-bright-5 enter-from-above">
            <p>Connecting…</p>
          </div>
        );
      }
    }

    if (!status) {
      let account = (
        <Button
          label="Account"
          onClick={this.props.goToAccount}
          disabled={this.props.view === "account" || !this.state.haveConnectedOnce}
        />
      );

      if (this.state.haveConnectedOnce && this.props.user.anonymous) {
        account = (
          <Button
            label="Sign in/up"
            onClick={this.props.goToSignInUp}
            disabled={this.props.view === "signInUp"}
          />
        );
      }

      buttons = (
        <div className="flex enter-from-above overflow-auto">
          <Button
            label="Today"
            onClick={this.props.goToToday}
            disabled={(this.props.view === "week" && this.props.targetIsToday) || !this.state.haveConnectedOnce}
          />
          <Button
            label="Zoom out"
            onClick={this.props.goToMonth}
            disabled={this.props.view === "month" || !this.state.haveConnectedOnce}
          />
          {account}
          <Button
            key="upButton"
            label="&nbsp;&uarr;&nbsp;"
            disabled={this.props.view !== "week" && this.props.view !== "month"}
            onClick={this.props.moveBackward}
          />
          <Button
            key="downButton"
            label="&nbsp;&darr;&nbsp;"
            disabled={this.props.view !== "week" && this.props.view !== "month"}
            onClick={this.props.moveForward}
          />
        </div>
      );
    }

    return (
      <div id="controls" className="border-bottom border-2">
        {status}
        {buttons}
      </div>
    );
  }
}

export default Controls;
