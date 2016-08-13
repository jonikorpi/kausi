import React, { Component } from "react";

import Form from "./Form";

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: null,
    };

    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  onEmailChange(value) {
    this.setState({email: value})
  }

  onPasswordChange(value) {
    this.setState({password: value})
  }

  signUp(fields) {
    this.props.signUp(fields.email.value, fields.password.value);
  }

  render() {
    let error;

    if (this.props.error) {
      error = (
        <p className="color-bright-6 text-align-center">{this.props.error}</p>
      );
    }

    return (
      <div className="grow bg-1 flex vertical justify-center align-center child-margins-y-1 padding-0-5 max-width-5 enter-zoom">
        <div className="color-4 text-align-center">
          <p>Entries are stored in plain text (in <a href="http://firebase.google.com/">Firebase</a>), so I don&rsquo;t recommend storing sensitive information using this app.</p>
          <p>Emails and passwords are securely stored using <a href="http://firebase.google.com/">Firebase authentication</a>.</p>
          <p>Your current entries will carry over to your new account.</p>
        </div>
        <Form
          onSubmit={this.signUp}
          fields={[
            {
              id: "email",
              type: "email",
              label: "Email",
            },
            {
              id: "password",
              type: "password",
              label: "Password",
            },
          ]}
          buttonLabel="Sign up"
        />
        {error}
      </div>
    );
  }
}

export default SignUp;
