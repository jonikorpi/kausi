import React from "react";
import Link from "next/link";

export default ({ anonymous, uid, url, replaceActiveLinkWith, ...props }) => {
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
      <style jsx>
        {`
        .navigation {
          position: absolute;
          right: 0; top: 0;
          font-size: 0.625rem;
          line-height: 0.625rem;
          z-index: 10;
          display: flex;
        }

        .navigation > :global(*) + :global(*) {
          margin-left: 0.5rem;
        }
      `}
      </style>

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
              <a className={active ? "active" : ""}>
                {link.title}
              </a>
            </Link>
          );
        }
      })}
    </nav>
  );
};
