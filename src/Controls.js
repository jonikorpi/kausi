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
    let connecting, signUp, signIn, account, today, zoomOut;

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
      if (this.props.view !== "week") {
        today = (
          <Button
            label="Today"
            onClick={this.props.goToToday}
          />
        );
      }
      if (this.props.view === "week") {
        zoomOut = (
          <Button
            label="Zoom out"
            onClick={this.props.zoomOut}
          />
        );
      }
    }
    else {
      connecting = (
        <div className="padding-0-5 text-align-center">
          Connecting…
        </div>
      );
    }

    let status;

    // if (this.props.user.uid) {
    //   if (this.props.user.anonymous) {
    //     status = "Temp. account";
    //   }
    //   else {
    //     status = "Online";
    //   }
    // }

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
            "flex even-children align-center color-bright-1 bg-5 relative enter-from-below": true,
          })}
        >
          {connecting}
          {today}
          {zoomOut}
          {account}
          {signUp}
          {signIn}
        </div>
        {status}
      </div>
    );
  }
}

export default Controls;
