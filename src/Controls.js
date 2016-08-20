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

    let status;

    if (!this.props.connected) {
      if (this.state.haveConnectedOnce) {
        status = (
          <div className="text-align-center padding-0-5 bg-5 color-bright-2">
            <p>Connection offline.</p>
            <p className="size-0-75">
              Text entry is disabled. Changes will not be saved before this message disappears.
            </p>
          </div>
        );
      }
      else {
        status = (
          <div className="text-align-center padding-0-5 bg-5 color-bright-2">
            <p>Connecting…</p>
          </div>
        );
      }
    }

    return (
      <div id="controls">
        {status}

        <div
          className={classNames({
            "flex even-children align-center color-bright-1 bg-4 relative enter-from-below": true,
          })}
        >

          <Button
            label="Today"
            onClick={this.props.goToToday}
            disabled={(this.props.view === "week" && this.props.targetIsToday) || !this.state.haveConnectedOnce}
          />
          <Button
            label="Someday"
            onClick={this.props.goToSomeday}
            disabled={this.props.view === "someday" || !this.state.haveConnectedOnce}
          />
          <Button
            label="Zoom out"
            onClick={this.props.goToMonth}
            disabled={this.props.view === "month" || !this.state.haveConnectedOnce}
          />
          {account}

        </div>
      </div>
    );
  }
}

export default Controls;
