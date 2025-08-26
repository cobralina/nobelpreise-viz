import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import prefixSelector from "postcss-prefix-selector";

const env = process.env;
const packageInfo = require("./package.json");
const sanitizedPackageName = packageInfo.name;

// Generate HTML content based on placeholders
function generateHtmlContent(
  isIframe,
  sanitizedPackageName,
  public_folder,
  packageInfoVersion,
  mode
) {
  let checkDomain = ``;
  if (mode != "test" && mode != "development") {
    const domain = "https://" + new URL(public_folder).hostname;
    checkDomain = `
      if (event.origin !== "${domain}") {
        return;
      }
    `;
  }
  if (isIframe) {
    return {
      polopoly: `
          <iframe id="iframe${sanitizedPackageName}" src="${public_folder}/iframe.html" frameborder="0" style="width: 100%"></iframe>
          <script>
            function handle${sanitizedPackageName}(event) {
              ${checkDomain}
              if (event.data.iframeHeight${sanitizedPackageName}) {
                document.getElementById("iframe${sanitizedPackageName}").style.height = event.data.iframeHeight${sanitizedPackageName} + 10 + "px";
              }
            }
            window.addEventListener("message", handle${sanitizedPackageName}, false);
          </script>
      `,
      iframe: `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex,indexifembedded" />
  <title>${sanitizedPackageName}</title>
</head>
<body style="padding: 0;margin: 0">
<!-- START ${sanitizedPackageName} (iframe version) -->
  <link rel="stylesheet" href="${public_folder}/css/styles.css" />
  <div data-version="${packageInfoVersion}" id="${sanitizedPackageName}"></div>
  <script src="${public_folder}/js/app.umd.js"></script>
  <script>
    function load_${sanitizedPackageName}() {
      if (typeof app_${sanitizedPackageName} !== "undefined") {
        app_${sanitizedPackageName}.mountApp("#${sanitizedPackageName}");
      } else {
        const appElement = document.getElementById("${sanitizedPackageName}");
        if (!appElement) {
          console.error('Element with id "app" not found.');
          return;
        }
        const script = document.createElement("script");
        script.src = "${public_folder}/js/app.umd.js";
        script.onload = () => app_${sanitizedPackageName}.mountApp("#${sanitizedPackageName}");
        appElement.parentNode.insertBefore(script, appElement.nextSibling);
      }
    }
    load_${sanitizedPackageName}();

    var sendPostMessage = () => {
      setInterval(() => {
        var app${sanitizedPackageName} = document.getElementById("${sanitizedPackageName}");
        var iframeHeight = app${sanitizedPackageName}.scrollHeight;
        if (iframeHeight) {
          parent.postMessage({ iframeHeight${sanitizedPackageName}: iframeHeight }, "*");
        }
      }, 1000);
    };
    window.onload = () => sendPostMessage();
  </script>
<!-- END -->
</body>
</html>
      `,
    };
  }

  return {
    polopoly: `
    <!-- START ${sanitizedPackageName} -->
  <link rel="stylesheet" href="${public_folder}/css/styles.css" />
  <div data-version="${packageInfoVersion}" id="${sanitizedPackageName}"></div>
  <script src="${public_folder}/js/app.umd.js"></script>
  <script>
    function load_${sanitizedPackageName}() {
      if (typeof app_${sanitizedPackageName} !== "undefined") {
        app_${sanitizedPackageName}.mountApp("#${sanitizedPackageName}");
      } else {
        const appElement = document.getElementById("${sanitizedPackageName}");
        if (!appElement) {
          console.error('Element with id "app" not found.');
          return;
        }
        const script = document.createElement("script");
        script.src = "${public_folder}/js/app.umd.js";
        script.onload = () => app_${sanitizedPackageName}.mountApp("#${sanitizedPackageName}");
        appElement.parentNode.insertBefore(script, appElement.nextSibling);
      }
    }
    load_${sanitizedPackageName}();
  </script>
<!-- END -->
`,
  };
}

export default ({ mode }) => {
  const isProduction = mode === "production";
  const env = loadEnv(mode, process.cwd(), "");

  const distribution_folder = `${env.VITE_APP_DISTRIBUTION_FOLDER}`;
  const public_folder = `${env.VITE_APP_BASE_URL}`;
  const isIframe = env.VITE_APP_IFRAME === "true";

  let hasSourcemap = false;
  if (env.VITE_APP_PRODUCTION_SOURCE_MAP === "true") {
    hasSourcemap = true;
  }

  // Fetch the appropriate HTML content
  const htmlContent = generateHtmlContent(
    isIframe,
    sanitizedPackageName,
    public_folder,
    packageInfo.version,
    mode
  );

  console.log(
    "------------------------------------------------------------------------"
  );
  console.log(" " + packageInfo.name + " - " + packageInfo.version);
  console.log(
    "------------------------------------------------------------------------"
  );

  return defineConfig({
    base: public_folder,
    build: {
      sourcemap: hasSourcemap,
      lib: {
        entry: "./src/main.ts",
        name: "app_" + sanitizedPackageName,
        fileName: "app",
        formats: ["es", "umd"],
      },
      rollupOptions: {
        output: {
          dir: distribution_folder,
          entryFileNames: `js/app.[format].js`,
          assetFileNames: (assetInfo) => {
            const ext = assetInfo.name.split(".").pop();
            if (ext === "css") {
              return "css/styles.css";
            }
            return "assets/[name].[ext]";
          },
        },
      },
    },
    define: {
      "process.env": {},
      __APP_NAME__: JSON.stringify(sanitizedPackageName),
      __APP_VERSION__: JSON.stringify(packageInfo.version),
    },
    css: {
      postcss: {
        plugins: [
          prefixSelector({
            prefix: `#${sanitizedPackageName}`,
            exclude: [`#${sanitizedPackageName}`, `#${sanitizedPackageName} `], // Match exact selector and any trailing spaces
          }),
        ],
      },
    },
    plugins: [
      svelte(),
      {
        name: "generate-index-html",
        apply: "build",
        generateBundle(_, bundle) {
          // Emit `polopoly.html`
          this.emitFile({
            type: "asset",
            fileName: "polopoly.html",
            source: htmlContent.polopoly.trim(),
          });
          this.emitFile({
            type: "asset",
            fileName: "index.html",
            source: `
<!DOCTYPE html>
  <html lang="de">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${sanitizedPackageName}</title>
  </head>
  <body>
    ${htmlContent.polopoly.trim()}
  </body>
</html>`,
          });

          //Emit `iframe.html` only if `isframe` is true
          if (isIframe) {
            this.emitFile({
              type: "asset",
              fileName: "iframe.html",
              source: htmlContent.iframe.trim(),
            });
          }
        },
      },
      // {
      //   name: "generate-index-html",
      //   apply: "build",
      //   generateBundle(_, bundle) {
      //     const htmlContent =
      //     this.emitFile({
      //       type: "asset",
      //       fileName: "polopoly.html",
      //       source: htmlContent.trim(),
      //     });
      //   },
      // },
    ],
    server: {
      open: true,
      host: "localhost",
      port: 3000,
    },
  });
};
