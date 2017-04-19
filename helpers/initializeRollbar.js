const env = (process && process.env && process.env.NODE_ENV) || "development";

if (typeof window !== "undefined" && !window.Rollbar) {
  window.Rollbar = require("rollbar-browser");
  window.Rollbar.init({
    accessToken: "1591caa2cfcf460791065f7c67646373",
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: env,
    },
  });
}
