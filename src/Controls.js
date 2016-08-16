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
    let signUp, signIn, account;

    if (this.state.haveConnectedOnce) {
      if (this.props.user.anonymous) {
        signUp = (
          <Button
            label="Sign up"
            onClick={this.props.signUp}
            disabled={this.props.view === "signUp"}
          />
        );
        signIn = (
          <Button
            label="Log in"
            onClick={this.props.signIn}
            disabled={this.props.view === "signIn"}
          />
        );
      }
      if (this.props.user.uid && !this.props.user.anonymous) {
        account = (
          <Button
            label="Account"
            onClick={this.props.goToAccount}
            disabled={this.props.view === "account"}
          />
        );
      }
    }

    let status;

    if (!this.props.connected && this.state.haveConnectedOnce) {
      status = (
        <div className="text-align-center padding-0-5 bg-5 color-bright-2">
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

    const viewIsWeekOrMonth = this.props.view === "week" || this.props.view === "month"

    return (
      <div>
        <div id="controls"
          className={classNames({
            "flex even-children align-center color-bright-1 bg-4 relative enter-from-below": true,
          })}
        >
          <Button
            label="&uarr;"
            onClick={this.props.moveBackward}
            disabled={!viewIsWeekOrMonth}
          />
          <Button
            label="Today"
            onClick={this.props.goToToday}
            disabled={this.props.view === "week" && this.props.targetIsToday}
          />
          {account}
          {signUp}
          {signIn}
          <Button
            label="&darr;"
            onClick={this.props.moveForward}
            disabled={!viewIsWeekOrMonth}
          />
        </div>
        {status}
      </div>
    );
  }
}

export default Controls;
