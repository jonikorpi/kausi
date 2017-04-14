import React from "react";

export default props => (
  <nav className="navigation">
    <style jsx>
      {`
          .navigation {
            position: fixed;
            right: 0; top: 0;
            font-size: 0.625rem;
            line-height: 0.625rem;
            z-index: 10;
            display: flex;
          }
        `}
    </style>

    {props.children}
  </nav>
);
