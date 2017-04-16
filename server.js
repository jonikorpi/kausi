const express = require("express");
const next = require("next");
const LRUCache = require("lru-cache");
const rollbar = require("rollbar");
const analytics = require("universal-analytics");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dir: ".", dev });
const handle = app.getRequestHandler();

// This is where we cache our rendered HTML pages
const ssrCache = new LRUCache({
  max: 100,
  maxAge: dev ? 0 : 1000 * 60 * 60 * 24, // 24h
});

app.prepare().then(() => {
  const server = express();

  server.use(analytics.middleware("UA-3628636-11", { https: true }));

  server.get("/lists", (req, res) => {
    renderAndCache(req, res, "/lists");
  });

  server.get("/authenticate", (req, res) => {
    renderAndCache(req, res, "/authenticate");
  });

  server.get("/account", (req, res) => {
    renderAndCache(req, res, "/account");
  });

  server.get("/:id", (req, res) => {
    renderAndCache(req, res, "/", { [req.params.id]: true });
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  // Report errors to Rollbar
  server.use(
    rollbar.errorHandler("e25b560b08f1410abf77cae0888e0acb", {
      environment: process.env.NODE_ENV || "development",
    })
  );

  server.listen(3000, err => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});

/*
 * NB: make sure to modify this to take into account anything that should trigger
 * an immediate page change (e.g a locale stored in req.session)
 */
function getCacheKey(req) {
  return `${req.url}`;
}

function renderAndCache(req, res, pagePath, queryParams) {
  const key = getCacheKey(req);

  // If we have a page in the cache, let's serve it
  if (ssrCache.has(key)) {
    res.send(ssrCache.get(key));
    return;
  }

  // If not let's render the page into HTML
  app
    .renderToHTML(req, res, pagePath, queryParams)
    .then(html => {
      // Let's cache this page
      ssrCache.set(key, html);

      res.send(html);
    })
    .catch(err => {
      app.renderError(err, req, res, pagePath, queryParams);
    });
}
