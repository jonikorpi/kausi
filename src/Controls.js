import React, { Component } from 'react';

import Button from "./Button";

class Controls extends Component {
  getSignUp(props) {
    if (props.user.anonymous) {
      return (
        <Button
          label="Sign up"
          onClick={props.signUp}
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
        />
      );
    }
  }

  getSignOut(props) {
    if (!props.user.anonymous) {
      return (
        <Button
          label="Log out"
          onClick={props.signOut}
        />
      );
    }
  }

  render() {
    return (
      <div id="controls" className="flex even-children bg-4 color-1">
        <Button
          label="Zoom out"
          onClick={false}
        />
        <Button
          label="Today"
          onClick={false}
          disabled={true}
        />
        {this.getSignUp(this.props)}
        {this.getSignIn(this.props)}
        {this.getSignOut(this.props)}
      </div>
    );
  }
}

export default Controls;
