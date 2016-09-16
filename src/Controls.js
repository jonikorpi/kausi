import React, { Component } from 'react';
import shallowCompare from "react-addons-shallow-compare";
// import classNames from "classnames";

import Button from "./Button";

class Controls extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    let status, buttons;

    const spinner = (<div className="spinner round height-1 width-1"></div>);

    if (!this.props.connected) {
      if (this.props.haveConnectedOnce) {
        status = (
          <div className="padding-0-5 color-bright-6 child-margins-x-0-5 flex">
            {spinner}
            <p>
              OFFLINE: any changes made will not be saved until this message disappears. If you close Kausi any unsaved changes will be lost.
            </p>
          </div>
        );
      }
      else {
        status = (
          <div className="padding-0-5 color-1 bg-5 child-margins-x-0-5 flex">
            {spinner}
            <p>Connecting…</p>
          </div>
        );
      }
    }

    if (!status && this.props.haveConnectedOnce) {
      let timeline, account, today;

      if (this.props.view !== "timeline") {
        timeline = (
          <Button
            label="Timeline"
            onClick={this.props.goToToday}
          />
        )
      }

      if (!this.props.anonymous && this.props.view !== "account") {
        account = (
          <Button
            label="Account"
            onClick={this.props.goToAccount}
          />
        );
      }
      else if (this.props.anonymous && this.props.view !== "signInUp") {
        account = (
          <Button
            label="Sign in/up"
            onClick={this.props.goToSignInUp}
          />
        );
      }

      if (this.props.view === "timeline") {

      }

      buttons = (
        <div className="flex child-margins-x-0-5">
          {today}
          {timeline}
          {account}
        </div>
      );
    }

    return (
      <div id="controls" className="fixed position-bottom-right margin-1 margin-top-0 margin-left-0">
        {status}
        {buttons}
      </div>
    );
  }
}

export default Controls;
