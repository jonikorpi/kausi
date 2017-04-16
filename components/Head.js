import React from "react";
import Head from "next/head";

export default props => (
  <Head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <link rel="manifest" href="/static/manifest.json?v=1.0" />
    {/* <meta name="apple-mobile-web-app-capable" content="yes"/> */}
    <meta name="mobile-web-app-capable" content="yes" />

    <link href="/static/reset.css" rel="stylesheet" />
    <link href="/static/base.css" rel="stylesheet" />

    <link
      href="/static/logo.png?v=1.0"
      rel="shortcut icon"
      type="image/png"
      sizes="any"
    />
    <link
      href="/static/logo.svg?v=1.0"
      rel="shortcut icon"
      type="image/svg+xml"
      sizes="any"
    />
    <link
      href="/static/logo.png?v=1.0"
      rel="apple-touch-icon"
      type="image/png"
      sizes="any"
    />
    <link
      href="/static/logo-black.svg?v=1.0"
      rel="mask-icon"
      color="#251916"
      type="image/svg+xml"
    />

    <meta
      content="https://kausi.xyz/static/logo.png?v=1.0"
      property="og:image"
    />
    <meta content="256" property="og:image:width" />
    <meta content="256" property="og:image:height" />

    <title>Kausi</title>
    <meta content="Kausi" property="og:title" />

    <meta content="A textarea for every day." name="description" />
    <meta content="A textarea for every day." property="og:description" />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@jonikorpi" />

    {props.children}
  </Head>
);
