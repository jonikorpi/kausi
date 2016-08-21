import React, { Component } from "react";

import Form from "./Form";
import Button from "./Button";
import About from "./About";

class SignInUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: "signUp"
    };

    this.signIn = this.signIn.bind(this);
    this.signUp = this.signUp.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.showSignIn = this.showSignIn.bind(this);
    this.showSignUp = this.showSignUp.bind(this);
    this.showResetPassword = this.showResetPassword.bind(this);
  }

  signIn(fields) {
    this.props.signIn(fields.emailIn.value, fields.passwordIn.value);
  }

  signUp(fields) {
    this.props.signUp(fields.emailUp.value, fields.passwordUp.value);
  }

  resetPassword(fields) {
    if (fields.email.value) {
      this.props.requestPasswordReset(fields.email.value);
    }
  }

  showSignIn() {
    this.setState({view: "signIn"})
  }

  showSignUp() {
    this.setState({view: "signUp"})
  }

  showResetPassword() {
    this.setState({view: "resetPassword"})
  }

  render() {
    let error, view;

    if (this.props.error) {
      error = (
        <p className="color-bright-6 text-align-center">{this.props.error}</p>
      );
    }

    switch (this.state.view) {
      case "signUp":
        view = (
          <div className="flex vertical align-center child-margins-y-1">
            <p className="wide-max-width">
              You are currently using a temporary account. If you sign up for a permanent account, any entries you made using this temporary account will carry over.
            </p>
            <p className="wide-max-width">
              With a permanent account you will be able to sign in from browsers other than this one, as well as export your entries (in the JSON format) whenever you want.
            </p>
            <p className="wide-max-width">
              Entries are stored in <a className="border-bottom" href="http://firebase.google.com/">Firebase</a>, unencrypted. Authentication is securely handled by Firebase.
            </p>
            <Form
              onSubmit={this.signUp}
              fields={[
                {
                  id: "emailUp",
                  type: "email",
                  label: "Email",
                },
                {
                  id: "passwordUp",
                  type: "password",
                  label: "Password",
                },
              ]}
              buttonLabel="Sign up"
            />
          </div>
        );
        break;
      case "resetPassword":
        view = (
          <div className="flex vertical align-center child-margins-y-1">
            <Form
              onSubmit={this.resetPassword}
              fields={[
                {
                  id: "email",
                  type: "email",
                  label: "Email",
                },
              ]}
              buttonLabel="Request password reset"
            />
          </div>
        );
        break;
      default:
      case "signIn":
        view = (
          <div className="flex vertical align-center child-margins-y-1">
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
              label="Sign up"
              onClick={this.showSignUp}
              disabled={this.state.view === "signUp"}
            />
            <Button
              label="Sign in"
              onClick={this.showSignIn}
              disabled={this.state.view === "signIn"}
            />
            <Button
              label="Reset password"
              onClick={this.showResetPassword}
              disabled={this.state.view === "resetPassword"}
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

export default SignInUp;
