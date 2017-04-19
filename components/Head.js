import React from "react";
import Head from "next/head";

import globalCSS from "../helpers/globalCSS";

export default props => (
  <Head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <style
      dangerouslySetInnerHTML={{
        __html: globalCSS.reset + globalCSS.fontFace + globalCSS.base,
      }}
    />

    <link rel="manifest" href="/static/manifest.json" />
    {/* <meta name="apple-mobile-web-app-capable" content="yes"/> */}
    <meta name="mobile-web-app-capable" content="yes" />

    <link
      href="/static/favicon.png"
      rel="shortcut icon"
      type="image/png"
      sizes="any"
    />
    <link
      href="/static/favicon.svg"
      rel="shortcut icon"
      type="image/svg+xml"
      sizes="any"
    />

    <link
      href="/static/icon.png"
      rel="apple-touch-icon-precomposed"
      type="image/png"
      sizes="any"
    />

    <meta content="https://kausi.xyz/static/icon.png" property="og:image" />
    <meta content="600" property="og:image:width" />
    <meta content="600" property="og:image:height" />

    <title>Kausi</title>
    <meta content="Kausi" property="og:title" />

    <meta content="A textarea for every day." name="description" />
    <meta content="A textarea for every day." property="og:description" />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@jonikorpi" />

    {props.children}
  </Head>
);
