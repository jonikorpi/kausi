import React from "react";
import Head from "next/head";

export default props => (
  <Head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <link rel="manifest" href="/static/manifest.json" />
    {/* <meta name="apple-mobile-web-app-capable" content="yes"/> */}
    <meta name="mobile-web-app-capable" content="yes" />

    <link href="/static/reset.css" rel="stylesheet" />
    <link href="/static/base.css" rel="stylesheet" />

    <style
      dangerouslySetInnerHTML={{
        __html: `
      @font-face {
        font-family: 'Inconsolata';
        font-style: normal;
        font-weight: 400;
        src: local('Inconsolata Regular'), local('Inconsolata-Regular'),
            url('/static/fonts/inconsolata-v15-latin-ext_latin-regular.woff2') format('woff2'),
            url('/static/fonts/inconsolata-v15-latin-ext_latin-regular.woff') format('woff');
      }
      @font-face {
        font-family: 'Inconsolata';
        font-style: normal;
        font-weight: 700;
        src: local('Inconsolata Bold'), local('Inconsolata-Bold'),
            url('/static/fonts/inconsolata-v15-latin-ext_latin-700.woff2') format('woff2'),
            url('/static/fonts/inconsolata-v15-latin-ext_latin-700.woff') format('woff');
      }
    `,
      }}
    />

    <link
      href="/static/favicon.png"
      rel="shortcut icon"
      type="image/png"
      sizes="any"
    />
    <link
      href="/static/logo.svg"
      rel="shortcut icon"
      type="image/svg+xml"
      sizes="any"
    />

    <link
      href="/static/icon.png"
      rel="apple-touch-icon"
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
