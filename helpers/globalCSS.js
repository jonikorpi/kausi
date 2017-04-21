export default {
  fontFace: `
    @font-face {
      font-family: 'Inconsolata';
      font-style: normal;
      font-weight: 400;
      src: local('Inconsolata Regular'), local('Inconsolata-Regular'),
          url('/static/fonts/inconsolata-v15-latin-ext_latin-regular.woff2?v1') format('woff2'),
          url('/static/fonts/inconsolata-v15-latin-ext_latin-regular.woff?v1') format('woff');
    }
    @font-face {
      font-family: 'Inconsolata';
      font-style: normal;
      font-weight: 700;
      src: local('Inconsolata Bold'), local('Inconsolata-Bold'),
          url('/static/fonts/inconsolata-v15-latin-ext_latin-700.woff2?v1') format('woff2'),
          url('/static/fonts/inconsolata-v15-latin-ext_latin-700.woff?v1') format('woff');
    }
  `,

  base: `
    html {
      font-family: Inconsolata, Menlo, monospace, monospace;
      font-size: 133%;
      font-size: calc(1.14em + 0.2vw + 0.2vh + 0.1vmin);
      color: hsl(0, 0%, 58.6%);
      background: black;
    }

    body {
      line-height: 1rem;
      font-size: 0.8rem;
    }

    .centered {
      text-align: center;
    }

    .page {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 100vh;
    }

    .heading {
      font-size: 0.625rem;
      line-height: 0.625rem;
      text-transform: uppercase;
    }

    .child-spacing > * + *,
    .page > * + * {
      margin-top: 1rem;
    }

    .padding {
      padding: .25rem;
    }

    @media (min-width: 40rem) {
      .padding {
        padding: .5rem;
      }
    }

    button,
    a {
      text-decoration: underline;
    }

    button:hover,
    button:focus,
    button.active,
    a:hover,
    a:focus,
    a.active,
    .bright {
      color: hsl(0, 0%, 91%);
      outline: none;
    }

    button.active,
    a.active {
      text-decoration: none;
    }

    button:active,
    a:active {
      color: hsl(0, 0%, 50%);
    }
  `,

  reset: `*{margin:0;padding:0;background:none;border:none;font:inherit;color:inherit;vertical-align:baseline;box-sizing:border-box;-webkit-text-decoration-skip:ink;text-decoration-skip:ink;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;text-size-adjust:100%}ol,ul{padding-left:1rem}article,aside,audio,canvas,details,figcaption,figure,footer,header,hgroup,img,main,menu,nav,section,summary,svg,video{display:block}a{background-color:transparent}sub,sup{font-size:75%;line-height:0;position:relative}sup{top:-.5em}sub{bottom:-.25em}[type=reset],[type=submit],button{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;border:none;border-radius:0;cursor:pointer;white-space:normal}[disabled]{cursor:not-allowed!important}::-webkit-input-placeholder{opacity:1;color:inherit}:-ms-input-placeholder{opacity:1;color:inherit}::placeholder{opacity:1;color:inherit}button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0}input[type=search]{-webkit-appearance:textfield}input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration{-webkit-appearance:none}textarea{overflow:auto;resize:vertical;display:block}table{border-collapse:collapse;border-spacing:0;min-width:100%}td,th{text-align:left}a,button,input,select,textarea{-ms-touch-action:manipulation;touch-action:manipulation}html{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"}`,
};
