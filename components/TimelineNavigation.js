import React, { Component } from "react";
import Link from "next/link";

export default class TimelineNavigation extends Component {
  render() {
    return (
      <div>
        <nav className="navigation">

          <button
            className="navigation-link"
            type="button"
            onClick={this.props.scrollToToday}
          >
            Today
          </button>

          <Link href="/lists">
            <a className="navigation-link">
              Lists
            </a>
          </Link>

          <Link href="/change-password">
            <a className="navigation-link">
              Account
            </a>
          </Link>

          <Link href="/sign-up">
            <a className="navigation-link">
              Sign up
            </a>
          </Link>

          <Link href="/log-in">
            <a className="navigation-link">
              Log in
            </a>
          </Link>
        </nav>
      </div>
    );
  }
}
