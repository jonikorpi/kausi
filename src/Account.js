import React, { Component } from "react";

import Form from "./Form";
import Button from "./Button";
import DataExport from "./DataExport";
import About from "./About";

class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: "changePassword"
    };

    this.setPassword = this.setPassword.bind(this);
    this.showChangePassword = this.showChangePassword.bind(this);
    this.showExportData = this.showExportData.bind(this);
  }

  setPassword(fields) {
    this.props.setPassword(fields.newPassword.value, fields.newPasswordAgain.value);
  }

  showChangePassword() {
    this.setState({view: "changePassword"})
  }

  showExportData() {
    this.setState({view: "exportData"})
  }

  render() {
    let error, view;

    if (this.props.error) {
      error = (
        <p className="color-bright-6">{this.props.error}</p>
      );
    }

    switch (this.state.view) {
      case "changePassword":
        view = (
          <div className="flex vertical align-center child-margins-y-1 padding-0-5">
            <Form
              weekNumber={1}
              onSubmit={this.setPassword}
              fields={[
                {
                  id: "newPassword",
                  type: "password",
                  label: "New password",
                },
                {
                  id: "newPasswordAgain",
                  type: "password",
                  label: "New password again",
                },
              ]}
              buttonLabel="Change password"
            />
          </div>
        );
        break;
      case "exportData":
        view = (
          <DataExport
            firebaseRef={this.props.firebaseRef}
          />
        );
        break;
      default:
      case "signIn":
        view = (
          <div className="flex vertical align-center child-margins-y-1 padding-0-5">
            <Form
              onSubmit={this.signIn}
              fields={[
                {
                  id: "emailIn",
                  type: "email",
                  label: "Email",
                },
                {
                  id: "passwordIn",
                  type: "password",
                  label: "Password",
                },
              ]}
              buttonLabel="Sign in"
            />
          </div>
        );
        break;
    }

    return (
      <div className="grow overflow-auto flex vertical">
        <div className="grow flex vertical justify-center child-margins-y-1 padding-0-5">
          <div className="flex justify-center">
            <Button
              label="Password"
              onClick={this.showChangePassword}
              className="rounded"
              disabled={this.state.view === "changePassword"}
            />
            <Button
              label="Export data"
              onClick={this.showExportData}
              className="rounded"
              disabled={this.state.view === "exportData"}
            />
            <Button
              label="Sign out"
              onClick={this.props.signOut}
              className="rounded"
            />
          </div>
          {view}
          {error}
          <About/>
        </div>
      </div>
    );
  }
}

export default Account;
