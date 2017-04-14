import React, { Component } from "react";
import Link from "next/link";

export default class Navigation extends Component {
  render() {
    const links = [
      {
        text: "Back",
        href: "/",
      },
      {
        text: "Log in",
        href: "/log-in",
      },
      {
        text: "Sign up",
        href: "/sign-up",
      },
      {
        text: "Reset password",
        href: "/reset-password",
      },
      {
        text: "Export your data",
        href: "/export-data",
      },
      {
        text: "Change password",
        href: "/change-password",
      },
      {
        text: "About Kausi",
        href: "/about",
      },
    ];

    return (
      <div className="navigation">
        {links.map(link => {
          return (
            <Link href={link.href} key={link.href}>
              <a className="navigation-link">
                {link.text}
              </a>
            </Link>
          );
        })}

        <button className="navigation-link" type="button">Log out</button>
      </div>
    );
  }
}
