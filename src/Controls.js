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

    const spinner = (<div className="spinner round border-bright-6 height-1 width-1"></div>);

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
          <div className="padding-0-5 color-bright-6 child-margins-x-0-5 flex">
            {spinner}
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
          disabled={this.props.view === "account" || !this.props.haveConnectedOnce}
        />
      );

      if (this.props.haveConnectedOnce && this.props.anonymous) {
        account = (
          <Button
            label="Sign in/up"
            onClick={this.props.goToSignInUp}
            disabled={this.props.view === "signInUp"}
          />
        );
      }

      buttons = (
        <div className="flex overflow-auto">
          <Button
            label="Today"
            onClick={this.props.goToToday}
            disabled={(this.props.view === "week" && this.props.targetIsToday) || !this.props.haveConnectedOnce}
          />
          {account}
        </div>
      );
    }

    return (
      <div id="controls" className="bg-3 fixed position-bottom-right">
        {status}
        {buttons}
      </div>
    );
  }
}

export default Controls;
