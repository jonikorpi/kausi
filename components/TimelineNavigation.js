import React, { Component } from "react";
import Link from "next/link";

export default class TimelineNavigation extends Component {
  render() {
    return (
      <div className="timeline-navigation">
        <style jsx>{`
          .timeline-navigation {
            position: fixed;
            left: 0;
            bottom: 2rem;
            right: 0;
          }

          .navigation {
            display: flex;
          }

          .navigation-link {
            padding: 0.5rem;
          }
        `}</style>

        <nav className="navigation">

          <button type="button">Today</button>

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
