import React, { Component } from 'react';
import classNames from "classnames";

import Button from "./Button";

class Controls extends Component {
  getSignUp(props) {
    if (props.user.anonymous) {
      return (
        <Button
          label="Sign up"
          onClick={props.signUp}
          disabled={true}
        />
      );
    }
  }

  getSignIn(props) {
    if (props.user.anonymous) {
      return (
        <Button
          label="Log in"
          onClick={props.signIn}
          disabled={true}
        />
      );
    }
  }

  getSignOut(props) {
    if (props.user.uid && !props.user.anonymous) {
      return (
        <Button
          label="Log out"
          onClick={props.signOut}
          disabled={true}
        />
      );
    }
  }

  render() {
    let status, extraStatus;

    if (this.props.user.uid) {
      if (this.props.user.anonymous) {
        status = "Temporary account";
        extraStatus = "Changes auto-saved"
      }
      else {
        status = "Connected";
        extraStatus = "Changes auto-saved"
      }
    }

    if (!this.props.connected) {
      status = "Offline";
      extraStatus = "Changes not saved"
    }

    return (
      <div id="controls" className="flex justify color-3 bg-1 padding-x padding-0-5">
        <div
          className={classNames({
            "padding-y nowrap enter-from-above": true,
            "padding-0-25 size-0-75": extraStatus,
            "padding-0-5": !extraStatus,
            "color-bright-5": !this.props.connected
          })}
        >
          <p>{status}</p>
          <p>{extraStatus}</p>
        </div>
        <div className="flex child-margins-x-1">
          {this.getSignUp(this.props)}
          {this.getSignIn(this.props)}
          {this.getSignOut(this.props)}
        </div>
      </div>
    );
  }
}

export default Controls;
