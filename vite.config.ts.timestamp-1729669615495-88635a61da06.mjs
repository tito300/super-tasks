// vite.config.ts
import react from "file:///home/work/code/super-tasks/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { resolve } from "path";
import fs from "fs";
import { defineConfig } from "file:///home/work/code/super-tasks/node_modules/vite/dist/node/index.js";
import { crx } from "file:///home/work/code/super-tasks/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// manifest.json
var manifest_default = {
  manifest_version: 3,
  name: "Super tasks",
  description: "Adds points to Google Tasks",
  oauth2: {
    client_id: "875323625973-pcdig9fjrq4l9ert26f74anqa4gfb84d.apps.googleusercontent.com",
    scopes: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/tasks",
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events"
    ]
  },
  options_ui: {
    page: "src/pages/options/index.html"
  },
  background: {
    service_worker: "src/pages/background/index.ts",
    type: "module"
  },
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: {
      "32": "icon-32.png"
    }
  },
  icons: {
    "128": "icon-128.png"
  },
  permissions: [
    "activeTab",
    "tabs",
    "storage",
    "identity",
    "alarms",
    "notifications",
    "system.display"
  ],
  chrome_url_overrides: { newtab: "src/pages/newtab/index.html" },
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      js: ["src/pages/content/index.tsx"],
      css: ["contentStyle.css"]
    }
  ],
  devtools_page: "src/pages/devtools/index.html",
  web_accessible_resources: [
    {
      resources: [
        "contentStyle.css",
        "icon-128.png",
        "icon-32.png",
        "google-tasks-icon.png",
        "chatgpt-icon.png"
      ],
      matches: ["<all_urls>"]
    }
  ]
};

// manifest.dev.json
var manifest_dev_default = {
  key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiuKr34K37js9DL8AldjxpzF45ybkHCy3tKuzQAZtfeVWE4LAv9DiWZKv+SV0BQbIEKfg4u57nr9uPQivnrjW8bXKXovKQPPybLs5FvqcJBXvmZkyHFuSAMwNZL0gw1UpNZZ90WovHIbV2ubZOklERoIuE+lF0Hw0wOTBRDMZAW4j4fsMzz/NFMoNQ5JXo1TtGe34RYqCV0CcO0Y3vtawcaywc5TNY6+2YYi9VAAh+PSscXptGhyDn3gdpxRpKiE4D1JolaXLF8r+kft91QFum4z79KXmIOcSfMAhVgnDH7Kqx5ivASPGu940oSNCdCwu3DZoiRIHEcGxImjieMJ2twIDAQAB",
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "public/dev-icon-32.png"
  },
  icons: {
    "128": "public/dev-icon-128.png"
  },
  web_accessible_resources: [
    {
      resources: [
        "contentStyle.css",
        "dev-icon-128.png",
        "dev-icon-32.png",
        "google-tasks-icon.png",
        "chatgpt-icon.png"
      ],
      matches: ["<all_urls>"]
    }
  ]
};

// package.json
var package_default = {
  name: "vite-web-extension",
  version: "1.1.0",
  description: "A simple chrome extension template with Vite, React, TypeScript and Tailwind CSS.",
  license: "MIT",
  repository: {
    type: "git",
    url: "https://github.com/JohnBra/web-extension.git"
  },
  scripts: {
    build: "vite build",
    dev: "nodemon"
  },
  type: "module",
  dependencies: {
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@emotion/react": "^11.11.3",
    "@emotion/styled": "^11.11.0",
    "@fontsource/roboto": "^5.0.8",
    "@mui/base": "^5.0.0-beta.59",
    "@mui/icons-material": "^5.15.10",
    "@mui/lab": "^5.0.0-alpha.170",
    "@mui/material": "^5.15.10",
    "@mui/x-date-pickers": "^7.2.0",
    "@tanstack/react-query": "^5.22.2",
    "@types/react-syntax-highlighter": "^15.5.13",
    axios: "^1.6.7",
    dayjs: "^1.11.10",
    react: "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.50.1",
    "react-markdown": "^9.0.1",
    "react-syntax-highlighter": "^15.6.1",
    rrule: "^2.8.1",
    "webextension-polyfill": "^0.10.0"
  },
  devDependencies: {
    "@crxjs/vite-plugin": "^1.0.14",
    "@tanstack/eslint-plugin-query": "^5.18.1",
    "@types/chrome": "^0.0.253",
    "@types/node": "^18.17.1",
    "@types/react": "^18.2.39",
    "@types/react-dom": "^18.2.17",
    "@types/webextension-polyfill": "^0.10.0",
    "@typescript-eslint/eslint-plugin": "^5.49.0",
    "@typescript-eslint/parser": "^5.49.0",
    "@vitejs/plugin-react-swc": "^3.0.1",
    autoprefixer: "^10.4.16",
    eslint: "^8.32.0",
    "eslint-config-prettier": "^8.6.0",
    "eslint-plugin-import": "^2.27.5",
    "eslint-plugin-jsx-a11y": "^6.7.1",
    "eslint-plugin-react": "^7.32.1",
    "eslint-plugin-react-hooks": "^4.3.0",
    "fs-extra": "^11.1.0",
    nodemon: "^2.0.20",
    postcss: "^8.4.31",
    tailwindcss: "^3.3.5",
    "ts-node": "^10.9.1",
    typescript: "^4.9.4",
    vite: "^4.5.0"
  }
};

// vite.config.ts
var __vite_injected_original_dirname = "/home/work/code/super-tasks";
var root = resolve(__vite_injected_original_dirname, "src");
var pagesDir = resolve(root, "pages");
var assetsDir = resolve(root, "assets");
var outDir = resolve(__vite_injected_original_dirname, "dist");
var publicDir = resolve(__vite_injected_original_dirname, "public");
var isDev = process.env.__DEV__ === "true";
var extensionManifest = {
  ...manifest_default,
  ...isDev ? manifest_dev_default : {},
  name: isDev ? `DEV: ${manifest_default.name}` : manifest_default.name,
  version: package_default.version
};
function stripDevIcons(apply) {
  if (apply)
    return null;
  return {
    name: "strip-dev-icons",
    resolveId(source) {
      return source === "virtual-module" ? source : null;
    },
    renderStart(outputOptions, inputOptions) {
      const outDir2 = outputOptions.dir;
      fs.rm(
        resolve(outDir2, "dev-icon-32.png"),
        () => console.log(`Deleted dev-icon-32.png frm prod build`)
      );
      fs.rm(
        resolve(outDir2, "dev-icon-128.png"),
        () => console.log(`Deleted dev-icon-128.png frm prod build`)
      );
    }
  };
}
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@src": root,
      "@assets": assetsDir,
      "@pages": pagesDir
    }
  },
  plugins: [
    react(),
    crx({
      manifest: extensionManifest,
      contentScripts: {
        injectCss: true
      }
    }),
    stripDevIcons(isDev)
  ],
  publicDir,
  build: {
    outDir,
    sourcemap: isDev,
    emptyOutDir: !isDev,
    rollupOptions: {
      input: {
        popup: "src/pages/popup/index.html",
        reminder: "src/pages/reminder/index.html"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAibWFuaWZlc3QuanNvbiIsICJtYW5pZmVzdC5kZXYuanNvbiIsICJwYWNrYWdlLmpzb24iXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS93b3JrL2NvZGUvc3VwZXItdGFza3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3dvcmsvY29kZS9zdXBlci10YXNrcy92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS93b3JrL2NvZGUvc3VwZXItdGFza3Mvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgY3J4LCBNYW5pZmVzdFYzRXhwb3J0IH0gZnJvbSBcIkBjcnhqcy92aXRlLXBsdWdpblwiO1xuXG5pbXBvcnQgbWFuaWZlc3QgZnJvbSBcIi4vbWFuaWZlc3QuanNvblwiO1xuaW1wb3J0IGRldk1hbmlmZXN0IGZyb20gXCIuL21hbmlmZXN0LmRldi5qc29uXCI7XG5pbXBvcnQgcGtnIGZyb20gXCIuL3BhY2thZ2UuanNvblwiO1xuXG5jb25zdCByb290ID0gcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjXCIpO1xuY29uc3QgcGFnZXNEaXIgPSByZXNvbHZlKHJvb3QsIFwicGFnZXNcIik7XG5jb25zdCBhc3NldHNEaXIgPSByZXNvbHZlKHJvb3QsIFwiYXNzZXRzXCIpO1xuY29uc3Qgb3V0RGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsIFwiZGlzdFwiKTtcbmNvbnN0IHB1YmxpY0RpciA9IHJlc29sdmUoX19kaXJuYW1lLCBcInB1YmxpY1wiKTtcblxuY29uc3QgaXNEZXYgPSBwcm9jZXNzLmVudi5fX0RFVl9fID09PSBcInRydWVcIjtcblxuY29uc3QgZXh0ZW5zaW9uTWFuaWZlc3QgPSB7XG4gIC4uLm1hbmlmZXN0LFxuICAuLi4oaXNEZXYgPyBkZXZNYW5pZmVzdCA6ICh7fSBhcyBNYW5pZmVzdFYzRXhwb3J0KSksXG4gIG5hbWU6IGlzRGV2ID8gYERFVjogJHttYW5pZmVzdC5uYW1lfWAgOiBtYW5pZmVzdC5uYW1lLFxuICB2ZXJzaW9uOiBwa2cudmVyc2lvbixcbn07XG5cbi8vIHBsdWdpbiB0byByZW1vdmUgZGV2IGljb25zIGZyb20gcHJvZCBidWlsZFxuZnVuY3Rpb24gc3RyaXBEZXZJY29ucyhhcHBseTogYm9vbGVhbikge1xuICBpZiAoYXBwbHkpIHJldHVybiBudWxsO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogXCJzdHJpcC1kZXYtaWNvbnNcIixcbiAgICByZXNvbHZlSWQoc291cmNlOiBzdHJpbmcpIHtcbiAgICAgIHJldHVybiBzb3VyY2UgPT09IFwidmlydHVhbC1tb2R1bGVcIiA/IHNvdXJjZSA6IG51bGw7XG4gICAgfSxcbiAgICByZW5kZXJTdGFydChvdXRwdXRPcHRpb25zOiBhbnksIGlucHV0T3B0aW9uczogYW55KSB7XG4gICAgICBjb25zdCBvdXREaXIgPSBvdXRwdXRPcHRpb25zLmRpcjtcbiAgICAgIGZzLnJtKHJlc29sdmUob3V0RGlyLCBcImRldi1pY29uLTMyLnBuZ1wiKSwgKCkgPT5cbiAgICAgICAgY29uc29sZS5sb2coYERlbGV0ZWQgZGV2LWljb24tMzIucG5nIGZybSBwcm9kIGJ1aWxkYClcbiAgICAgICk7XG4gICAgICBmcy5ybShyZXNvbHZlKG91dERpciwgXCJkZXYtaWNvbi0xMjgucG5nXCIpLCAoKSA9PlxuICAgICAgICBjb25zb2xlLmxvZyhgRGVsZXRlZCBkZXYtaWNvbi0xMjgucG5nIGZybSBwcm9kIGJ1aWxkYClcbiAgICAgICk7XG4gICAgfSxcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBzcmNcIjogcm9vdCxcbiAgICAgIFwiQGFzc2V0c1wiOiBhc3NldHNEaXIsXG4gICAgICBcIkBwYWdlc1wiOiBwYWdlc0RpcixcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBjcngoe1xuICAgICAgbWFuaWZlc3Q6IGV4dGVuc2lvbk1hbmlmZXN0IGFzIE1hbmlmZXN0VjNFeHBvcnQsXG4gICAgICBjb250ZW50U2NyaXB0czoge1xuICAgICAgICBpbmplY3RDc3M6IHRydWUsXG4gICAgICB9LFxuICAgIH0pLFxuICAgIHN0cmlwRGV2SWNvbnMoaXNEZXYpLFxuICBdLFxuICBwdWJsaWNEaXIsXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyLFxuICAgIHNvdXJjZW1hcDogaXNEZXYsXG4gICAgZW1wdHlPdXREaXI6ICFpc0RldixcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBpbnB1dDoge1xuICAgICAgICBwb3B1cDogXCJzcmMvcGFnZXMvcG9wdXAvaW5kZXguaHRtbFwiLFxuICAgICAgICByZW1pbmRlcjogXCJzcmMvcGFnZXMvcmVtaW5kZXIvaW5kZXguaHRtbFwiLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iLCAie1xuICBcIm1hbmlmZXN0X3ZlcnNpb25cIjogMyxcbiAgXCJuYW1lXCI6IFwiU3VwZXIgdGFza3NcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkFkZHMgcG9pbnRzIHRvIEdvb2dsZSBUYXNrc1wiLFxuICBcIm9hdXRoMlwiOiB7XG4gICAgXCJjbGllbnRfaWRcIjogXCI4NzUzMjM2MjU5NzMtcGNkaWc5ZmpycTRsOWVydDI2Zjc0YW5xYTRnZmI4NGQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb21cIixcbiAgICBcInNjb3Blc1wiOiBbXG4gICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvdXNlcmluZm8uZW1haWxcIixcbiAgICAgIFwiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC90YXNrc1wiLFxuICAgICAgXCJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL2NhbGVuZGFyXCIsXG4gICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvY2FsZW5kYXIuZXZlbnRzXCJcbiAgICBdXG4gIH0sXG4gIFwib3B0aW9uc191aVwiOiB7XG4gICAgXCJwYWdlXCI6IFwic3JjL3BhZ2VzL29wdGlvbnMvaW5kZXguaHRtbFwiXG4gIH0sXG4gIFwiYmFja2dyb3VuZFwiOiB7XG4gICAgXCJzZXJ2aWNlX3dvcmtlclwiOiBcInNyYy9wYWdlcy9iYWNrZ3JvdW5kL2luZGV4LnRzXCIsXG4gICAgXCJ0eXBlXCI6IFwibW9kdWxlXCJcbiAgfSxcbiAgXCJhY3Rpb25cIjoge1xuICAgIFwiZGVmYXVsdF9wb3B1cFwiOiBcInNyYy9wYWdlcy9wb3B1cC9pbmRleC5odG1sXCIsXG4gICAgXCJkZWZhdWx0X2ljb25cIjoge1xuICAgICAgXCIzMlwiOiBcImljb24tMzIucG5nXCJcbiAgICB9XG4gIH0sXG4gIFwiaWNvbnNcIjoge1xuICAgIFwiMTI4XCI6IFwiaWNvbi0xMjgucG5nXCJcbiAgfSxcbiAgXCJwZXJtaXNzaW9uc1wiOiBbXG4gICAgXCJhY3RpdmVUYWJcIixcbiAgICBcInRhYnNcIixcbiAgICBcInN0b3JhZ2VcIixcbiAgICBcImlkZW50aXR5XCIsXG4gICAgXCJhbGFybXNcIixcbiAgICBcIm5vdGlmaWNhdGlvbnNcIixcbiAgICBcInN5c3RlbS5kaXNwbGF5XCJcbiAgXSxcbiAgXCJjaHJvbWVfdXJsX292ZXJyaWRlc1wiOiB7IFwibmV3dGFiXCI6IFwic3JjL3BhZ2VzL25ld3RhYi9pbmRleC5odG1sXCIgfSxcbiAgXCJjb250ZW50X3NjcmlwdHNcIjogW1xuICAgIHtcbiAgICAgIFwibWF0Y2hlc1wiOiBbXCJodHRwOi8vKi8qXCIsIFwiaHR0cHM6Ly8qLypcIiwgXCI8YWxsX3VybHM+XCJdLFxuICAgICAgXCJqc1wiOiBbXCJzcmMvcGFnZXMvY29udGVudC9pbmRleC50c3hcIl0sXG4gICAgICBcImNzc1wiOiBbXCJjb250ZW50U3R5bGUuY3NzXCJdXG4gICAgfVxuICBdLFxuICBcImRldnRvb2xzX3BhZ2VcIjogXCJzcmMvcGFnZXMvZGV2dG9vbHMvaW5kZXguaHRtbFwiLFxuICBcIndlYl9hY2Nlc3NpYmxlX3Jlc291cmNlc1wiOiBbXG4gICAge1xuICAgICAgXCJyZXNvdXJjZXNcIjogW1xuICAgICAgICBcImNvbnRlbnRTdHlsZS5jc3NcIixcbiAgICAgICAgXCJpY29uLTEyOC5wbmdcIixcbiAgICAgICAgXCJpY29uLTMyLnBuZ1wiLFxuICAgICAgICBcImdvb2dsZS10YXNrcy1pY29uLnBuZ1wiLFxuICAgICAgICBcImNoYXRncHQtaWNvbi5wbmdcIlxuICAgICAgXSxcbiAgICAgIFwibWF0Y2hlc1wiOiBbXCI8YWxsX3VybHM+XCJdXG4gICAgfVxuICBdXG59XG4iLCAie1xuICBcImtleVwiOiBcIk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBaXVLcjM0SzM3anM5REw4QWxkanhwekY0NXlia0hDeTN0S3V6UUFadGZlVldFNExBdjlEaVdaS3YrU1YwQlFiSUVLZmc0dTU3bnI5dVBRaXZucmpXOGJYS1hvdktRUFB5YkxzNUZ2cWNKQlh2bVpreUhGdVNBTXdOWkwwZ3cxVXBOWlo5MFdvdkhJYlYydWJaT2tsRVJvSXVFK2xGMEh3MHdPVEJSRE1aQVc0ajRmc016ei9ORk1vTlE1SlhvMVR0R2UzNFJZcUNWMENjTzBZM3Z0YXdjYXl3YzVUTlk2KzJZWWk5VkFBaCtQU3NjWHB0R2h5RG4zZ2RweFJwS2lFNEQxSm9sYVhMRjhyK2tmdDkxUUZ1bTR6NzlLWG1JT2NTZk1BaFZnbkRIN0txeDVpdkFTUEd1OTQwb1NOQ2RDd3UzRFpvaVJJSEVjR3hJbWppZU1KMnR3SURBUUFCXCIsXG4gIFwiYWN0aW9uXCI6IHtcbiAgICBcImRlZmF1bHRfcG9wdXBcIjogXCJzcmMvcGFnZXMvcG9wdXAvaW5kZXguaHRtbFwiLFxuICAgIFwiZGVmYXVsdF9pY29uXCI6IFwicHVibGljL2Rldi1pY29uLTMyLnBuZ1wiXG4gIH0sXG4gIFwiaWNvbnNcIjoge1xuICAgIFwiMTI4XCI6IFwicHVibGljL2Rldi1pY29uLTEyOC5wbmdcIlxuICB9LFxuICBcIndlYl9hY2Nlc3NpYmxlX3Jlc291cmNlc1wiOiBbXG4gICAge1xuICAgICAgXCJyZXNvdXJjZXNcIjogW1xuICAgICAgICBcImNvbnRlbnRTdHlsZS5jc3NcIixcbiAgICAgICAgXCJkZXYtaWNvbi0xMjgucG5nXCIsXG4gICAgICAgIFwiZGV2LWljb24tMzIucG5nXCIsXG4gICAgICAgIFwiZ29vZ2xlLXRhc2tzLWljb24ucG5nXCIsXG4gICAgICAgIFwiY2hhdGdwdC1pY29uLnBuZ1wiXG4gICAgICBdLFxuICAgICAgXCJtYXRjaGVzXCI6IFtcIjxhbGxfdXJscz5cIl1cbiAgICB9XG4gIF1cbn1cbiIsICJ7XG4gIFwibmFtZVwiOiBcInZpdGUtd2ViLWV4dGVuc2lvblwiLFxuICBcInZlcnNpb25cIjogXCIxLjEuMFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiQSBzaW1wbGUgY2hyb21lIGV4dGVuc2lvbiB0ZW1wbGF0ZSB3aXRoIFZpdGUsIFJlYWN0LCBUeXBlU2NyaXB0IGFuZCBUYWlsd2luZCBDU1MuXCIsXG4gIFwibGljZW5zZVwiOiBcIk1JVFwiLFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL0pvaG5CcmEvd2ViLWV4dGVuc2lvbi5naXRcIlxuICB9LFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiYnVpbGRcIjogXCJ2aXRlIGJ1aWxkXCIsXG4gICAgXCJkZXZcIjogXCJub2RlbW9uXCJcbiAgfSxcbiAgXCJ0eXBlXCI6IFwibW9kdWxlXCIsXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBkbmQta2l0L2NvcmVcIjogXCJeNi4xLjBcIixcbiAgICBcIkBkbmQta2l0L3NvcnRhYmxlXCI6IFwiXjguMC4wXCIsXG4gICAgXCJAZG5kLWtpdC91dGlsaXRpZXNcIjogXCJeMy4yLjJcIixcbiAgICBcIkBlbW90aW9uL3JlYWN0XCI6IFwiXjExLjExLjNcIixcbiAgICBcIkBlbW90aW9uL3N0eWxlZFwiOiBcIl4xMS4xMS4wXCIsXG4gICAgXCJAZm9udHNvdXJjZS9yb2JvdG9cIjogXCJeNS4wLjhcIixcbiAgICBcIkBtdWkvYmFzZVwiOiBcIl41LjAuMC1iZXRhLjU5XCIsXG4gICAgXCJAbXVpL2ljb25zLW1hdGVyaWFsXCI6IFwiXjUuMTUuMTBcIixcbiAgICBcIkBtdWkvbGFiXCI6IFwiXjUuMC4wLWFscGhhLjE3MFwiLFxuICAgIFwiQG11aS9tYXRlcmlhbFwiOiBcIl41LjE1LjEwXCIsXG4gICAgXCJAbXVpL3gtZGF0ZS1waWNrZXJzXCI6IFwiXjcuMi4wXCIsXG4gICAgXCJAdGFuc3RhY2svcmVhY3QtcXVlcnlcIjogXCJeNS4yMi4yXCIsXG4gICAgXCJAdHlwZXMvcmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyXCI6IFwiXjE1LjUuMTNcIixcbiAgICBcImF4aW9zXCI6IFwiXjEuNi43XCIsXG4gICAgXCJkYXlqc1wiOiBcIl4xLjExLjEwXCIsXG4gICAgXCJyZWFjdFwiOiBcIl4xOC4yLjBcIixcbiAgICBcInJlYWN0LWRvbVwiOiBcIl4xOC4yLjBcIixcbiAgICBcInJlYWN0LWhvb2stZm9ybVwiOiBcIl43LjUwLjFcIixcbiAgICBcInJlYWN0LW1hcmtkb3duXCI6IFwiXjkuMC4xXCIsXG4gICAgXCJyZWFjdC1zeW50YXgtaGlnaGxpZ2h0ZXJcIjogXCJeMTUuNi4xXCIsXG4gICAgXCJycnVsZVwiOiBcIl4yLjguMVwiLFxuICAgIFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI6IFwiXjAuMTAuMFwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBjcnhqcy92aXRlLXBsdWdpblwiOiBcIl4xLjAuMTRcIixcbiAgICBcIkB0YW5zdGFjay9lc2xpbnQtcGx1Z2luLXF1ZXJ5XCI6IFwiXjUuMTguMVwiLFxuICAgIFwiQHR5cGVzL2Nocm9tZVwiOiBcIl4wLjAuMjUzXCIsXG4gICAgXCJAdHlwZXMvbm9kZVwiOiBcIl4xOC4xNy4xXCIsXG4gICAgXCJAdHlwZXMvcmVhY3RcIjogXCJeMTguMi4zOVwiLFxuICAgIFwiQHR5cGVzL3JlYWN0LWRvbVwiOiBcIl4xOC4yLjE3XCIsXG4gICAgXCJAdHlwZXMvd2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI6IFwiXjAuMTAuMFwiLFxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L2VzbGludC1wbHVnaW5cIjogXCJeNS40OS4wXCIsXG4gICAgXCJAdHlwZXNjcmlwdC1lc2xpbnQvcGFyc2VyXCI6IFwiXjUuNDkuMFwiLFxuICAgIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI6IFwiXjMuMC4xXCIsXG4gICAgXCJhdXRvcHJlZml4ZXJcIjogXCJeMTAuNC4xNlwiLFxuICAgIFwiZXNsaW50XCI6IFwiXjguMzIuMFwiLFxuICAgIFwiZXNsaW50LWNvbmZpZy1wcmV0dGllclwiOiBcIl44LjYuMFwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1pbXBvcnRcIjogXCJeMi4yNy41XCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLWpzeC1hMTF5XCI6IFwiXjYuNy4xXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXJlYWN0XCI6IFwiXjcuMzIuMVwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1yZWFjdC1ob29rc1wiOiBcIl40LjMuMFwiLFxuICAgIFwiZnMtZXh0cmFcIjogXCJeMTEuMS4wXCIsXG4gICAgXCJub2RlbW9uXCI6IFwiXjIuMC4yMFwiLFxuICAgIFwicG9zdGNzc1wiOiBcIl44LjQuMzFcIixcbiAgICBcInRhaWx3aW5kY3NzXCI6IFwiXjMuMy41XCIsXG4gICAgXCJ0cy1ub2RlXCI6IFwiXjEwLjkuMVwiLFxuICAgIFwidHlwZXNjcmlwdFwiOiBcIl40LjkuNFwiLFxuICAgIFwidml0ZVwiOiBcIl40LjUuMFwiXG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVEsT0FBTyxXQUFXO0FBQ3JSLFNBQVMsZUFBZTtBQUN4QixPQUFPLFFBQVE7QUFDZixTQUFTLG9CQUFvQjtBQUM3QixTQUFTLFdBQTZCOzs7QUNKdEM7QUFBQSxFQUNFLGtCQUFvQjtBQUFBLEVBQ3BCLE1BQVE7QUFBQSxFQUNSLGFBQWU7QUFBQSxFQUNmLFFBQVU7QUFBQSxJQUNSLFdBQWE7QUFBQSxJQUNiLFFBQVU7QUFBQSxNQUNSO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFlBQWM7QUFBQSxJQUNaLE1BQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxZQUFjO0FBQUEsSUFDWixnQkFBa0I7QUFBQSxJQUNsQixNQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsUUFBVTtBQUFBLElBQ1IsZUFBaUI7QUFBQSxJQUNqQixjQUFnQjtBQUFBLE1BQ2QsTUFBTTtBQUFBLElBQ1I7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsRUFDVDtBQUFBLEVBQ0EsYUFBZTtBQUFBLElBQ2I7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQUEsRUFDQSxzQkFBd0IsRUFBRSxRQUFVLDhCQUE4QjtBQUFBLEVBQ2xFLGlCQUFtQjtBQUFBLElBQ2pCO0FBQUEsTUFDRSxTQUFXLENBQUMsY0FBYyxlQUFlLFlBQVk7QUFBQSxNQUNyRCxJQUFNLENBQUMsNkJBQTZCO0FBQUEsTUFDcEMsS0FBTyxDQUFDLGtCQUFrQjtBQUFBLElBQzVCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsZUFBaUI7QUFBQSxFQUNq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
