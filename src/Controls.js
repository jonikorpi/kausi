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
    let signUp, signIn, account, today, moveBackward, moveForward;

    if (this.state.haveConnectedOnce) {
      if (this.props.user.anonymous && this.props.view !== "signUp") {
        signUp = (
          <Button
            label="Sign up"
            onClick={this.props.signUp}
          />
        );
      }
      if (this.props.user.anonymous) {
        signIn = (
          <Button
            label="Log in"
            onClick={this.props.signIn}
          />
        );
      }
      if (this.props.user.uid && !this.props.user.anonymous && this.props.view !== "account") {
        account = (
          <Button
            label="Account"
            onClick={this.props.goToAccount}
          />
        );
      }
      if (true) {
        today = (
          <Button
            label="Today"
            onClick={this.props.goToToday}
            disabled={this.props.view === "week" && this.props.targetIsToday}
          />
        );
      }
      if (this.props.view === "week" || this.props.view === "month") {
        moveBackward = (
          <Button
            label="&uarr;"
            onClick={this.props.moveBackward}
          />
        );

        moveForward = (
          <Button
            label="&darr;"
            onClick={this.props.moveForward}
          />
        );
      }
    }

    let status;

    if (!this.props.connected && this.state.haveConnectedOnce) {
      status = (
        <div className="text-align-center padding-0-5 bg-bright-6 color-bright-2">
          <p>Connection offline.</p>
          <p className="size-0-75">
            Changes will not be saved before this message disappears.
          </p>
          <p className="size-0-75">
            If you close this app now, unsaved changes may disappear.
          </p>
        </div>
      );
    }

    return (
      <div>
        <div id="controls"
          className={classNames({
            "flex even-children align-center color-bright-1 bg-4 relative enter-from-below": true,
          })}
        >
          {moveBackward}
          {today}
          {account}
          {signUp}
          {signIn}
          {moveForward}
        </div>
        {status}
      </div>
    );
  }
}

export default Controls;
