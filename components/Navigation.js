import React, { PureComponent } from "react";
import Link from "next/link";
import Router from "next/router";

export default class Editor extends PureComponent {
  componentDidMount() {
    this.mounted = true;

    Router.onRouteChangeStart = url => {
      this.showLoading();
    };

    Router.onRouteChangeComplete = () => {
      this.hideLoading();
    };

    Router.onRouteChangeError = () => {
      this.hideLoading();
    };
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  showLoading = () => {
    this.mounted && this.setState({ loading: true });
  };

  hideLoading = () => {
    this.mounted && this.setState({ loading: false });
  };

  render() {
    const { anonymous, uid, url, replaceActiveLinkWith, ...props } = {
      ...this.props,
    };
    const loading = this.state && this.state.loading;

    const links = [
      { title: "Timeline", url: "/" },
      { title: "Lists", url: "/lists" },
      {
        title: "Account",
        url: "/account",
        hideIf: uid && anonymous,
      },
      {
        title: "Log in/Sign up",
        url: "/authenticate",
        hideIf: !uid || (uid && !anonymous),
      },
    ];

    return (
      <nav className="navigation padding">
        <style jsx>{`
          .navigation {
            position: absolute;
            right: 0; top: 0;
            font-size: 0.625rem;
            line-height: 0.625rem;
            z-index: 10;
            display: flex;
            align-items: flex-start;
          }

          .navigation > :global(*) + :global(*) {
            margin-left: 0.5rem;
          }

          .spinner {
            border: 2px dotted;
            width: 0.625rem;
            height: 0.625rem;
            will-change: transform, opacity;
            animation:
              spin 1s linear infinite,
              appear 162ms ease-out
            ;
            border-radius: 50%;
          }

          @keyframes spin {
            100% { transform: rotate(360deg); }
          }

          @keyframes appear {
            0%   { opacity: 0; }
            100% { opacity: 1; }
          }
        `}</style>

        {loading && <div className="spinner" />}

        {props.children}

        {links.map((link, index) => {
          const active = link.url === url.pathname;

          if (link.hideIf) {
            return false;
          } else if (replaceActiveLinkWith && active) {
            return replaceActiveLinkWith;
          } else {
            return (
              <Link href={link.url} key={index}>
                <a className={active ? "active" : ""} tabIndex="-1">
                  {link.title}
                </a>
              </Link>
            );
          }
        })}
      </nav>
    );
  }
}
