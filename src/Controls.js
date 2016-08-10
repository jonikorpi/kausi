import React, { Component } from 'react';
import classNames from "classnames";

import Button from "./Button";

class Controls extends Component {

  render() {
    let signUp, signOut, signIn, today;

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
    if (this.props.user.uid && !this.props.user.anonymous) {
      signOut = (
        <Button
          label="Log out"
          onClick={this.props.signOut}
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

    let status, extraStatus;

    if (this.props.user.uid) {
      if (this.props.user.anonymous) {
        status = "Temporary account";
        extraStatus = "Changes auto-saved"
      }
      else {
        status = "Signed in";
        extraStatus = "Changes auto-saved"
      }
    }

    if (!this.props.connected) {
      status = "Offline";
      extraStatus = "Changes not saved"
    }

    return (
      <div id="controls" className="flex justify color-1 bg-4 relative enter-from-below">
        <div className="flex">
          <div className="padding-0-5 padding-x">
            <div
              className={classNames({
                "padding-y nowrap": true,
                "padding-0-25 size-0-75": extraStatus,
                "padding-0-5": !extraStatus,
                "color-bright-2": !this.props.connected
              })}
            >
              <p>{status}</p>
              <p>{extraStatus}</p>
            </div>
          </div>
        </div>

        <div className="flex">
          {today}
          {signUp}
          {signIn}
          {signOut}
        </div>

      </div>
    );
  }
}

export default Controls;
