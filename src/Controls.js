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
    return (
      <div id="controls" className="flex justify color-3 bg-1 enter-from-above">
        <div className="padding-0-5 nowrap all-caps">
          Connecting…
        </div>
        <div className="flex">
          {this.getSignUp(this.props)}
          {this.getSignIn(this.props)}
          {this.getSignOut(this.props)}
        </div>
      </div>
    );
  }
}

export default Controls;
