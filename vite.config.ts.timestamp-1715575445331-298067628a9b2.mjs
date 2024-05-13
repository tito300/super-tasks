// vite.config.ts
import react from "file:///Users/yocaal/super-tasks/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { resolve } from "path";
import fs from "fs";
import { defineConfig } from "file:///Users/yocaal/super-tasks/node_modules/vite/dist/node/index.js";
import { crx } from "file:///Users/yocaal/super-tasks/node_modules/@crxjs/vite-plugin/dist/index.mjs";

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
  permissions: ["activeTab", "tabs", "storage", "identity", "alarms", "notifications", "system.display"],
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
      resources: ["contentStyle.css", "icon-128.png", "icon-32.png"],
      matches: []
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
      resources: ["contentStyle.css", "dev-icon-128.png", "dev-icon-32.png"],
      matches: []
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
    "@mui/icons-material": "^5.15.10",
    "@mui/lab": "^5.0.0-alpha.170",
    "@mui/material": "^5.15.10",
    "@mui/x-date-pickers": "^7.2.0",
    "@tanstack/react-query": "^5.22.2",
    axios: "^1.6.7",
    dayjs: "^1.11.10",
    react: "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.50.1",
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
var __vite_injected_original_dirname = "/Users/yocaal/super-tasks";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAibWFuaWZlc3QuanNvbiIsICJtYW5pZmVzdC5kZXYuanNvbiIsICJwYWNrYWdlLmpzb24iXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMveW9jYWFsL3N1cGVyLXRhc2tzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMveW9jYWFsL3N1cGVyLXRhc2tzL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy95b2NhYWwvc3VwZXItdGFza3Mvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgY3J4LCBNYW5pZmVzdFYzRXhwb3J0IH0gZnJvbSBcIkBjcnhqcy92aXRlLXBsdWdpblwiO1xuXG5pbXBvcnQgbWFuaWZlc3QgZnJvbSBcIi4vbWFuaWZlc3QuanNvblwiO1xuaW1wb3J0IGRldk1hbmlmZXN0IGZyb20gXCIuL21hbmlmZXN0LmRldi5qc29uXCI7XG5pbXBvcnQgcGtnIGZyb20gXCIuL3BhY2thZ2UuanNvblwiO1xuXG5jb25zdCByb290ID0gcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjXCIpO1xuY29uc3QgcGFnZXNEaXIgPSByZXNvbHZlKHJvb3QsIFwicGFnZXNcIik7XG5jb25zdCBhc3NldHNEaXIgPSByZXNvbHZlKHJvb3QsIFwiYXNzZXRzXCIpO1xuY29uc3Qgb3V0RGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsIFwiZGlzdFwiKTtcbmNvbnN0IHB1YmxpY0RpciA9IHJlc29sdmUoX19kaXJuYW1lLCBcInB1YmxpY1wiKTtcblxuY29uc3QgaXNEZXYgPSBwcm9jZXNzLmVudi5fX0RFVl9fID09PSBcInRydWVcIjtcblxuY29uc3QgZXh0ZW5zaW9uTWFuaWZlc3QgPSB7XG4gIC4uLm1hbmlmZXN0LFxuICAuLi4oaXNEZXYgPyBkZXZNYW5pZmVzdCA6ICh7fSBhcyBNYW5pZmVzdFYzRXhwb3J0KSksXG4gIG5hbWU6IGlzRGV2ID8gYERFVjogJHttYW5pZmVzdC5uYW1lfWAgOiBtYW5pZmVzdC5uYW1lLFxuICB2ZXJzaW9uOiBwa2cudmVyc2lvbixcbn07XG5cbi8vIHBsdWdpbiB0byByZW1vdmUgZGV2IGljb25zIGZyb20gcHJvZCBidWlsZFxuZnVuY3Rpb24gc3RyaXBEZXZJY29ucyhhcHBseTogYm9vbGVhbikge1xuICBpZiAoYXBwbHkpIHJldHVybiBudWxsO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogXCJzdHJpcC1kZXYtaWNvbnNcIixcbiAgICByZXNvbHZlSWQoc291cmNlOiBzdHJpbmcpIHtcbiAgICAgIHJldHVybiBzb3VyY2UgPT09IFwidmlydHVhbC1tb2R1bGVcIiA/IHNvdXJjZSA6IG51bGw7XG4gICAgfSxcbiAgICByZW5kZXJTdGFydChvdXRwdXRPcHRpb25zOiBhbnksIGlucHV0T3B0aW9uczogYW55KSB7XG4gICAgICBjb25zdCBvdXREaXIgPSBvdXRwdXRPcHRpb25zLmRpcjtcbiAgICAgIGZzLnJtKHJlc29sdmUob3V0RGlyLCBcImRldi1pY29uLTMyLnBuZ1wiKSwgKCkgPT5cbiAgICAgICAgY29uc29sZS5sb2coYERlbGV0ZWQgZGV2LWljb24tMzIucG5nIGZybSBwcm9kIGJ1aWxkYClcbiAgICAgICk7XG4gICAgICBmcy5ybShyZXNvbHZlKG91dERpciwgXCJkZXYtaWNvbi0xMjgucG5nXCIpLCAoKSA9PlxuICAgICAgICBjb25zb2xlLmxvZyhgRGVsZXRlZCBkZXYtaWNvbi0xMjgucG5nIGZybSBwcm9kIGJ1aWxkYClcbiAgICAgICk7XG4gICAgfSxcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBzcmNcIjogcm9vdCxcbiAgICAgIFwiQGFzc2V0c1wiOiBhc3NldHNEaXIsXG4gICAgICBcIkBwYWdlc1wiOiBwYWdlc0RpcixcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBjcngoe1xuICAgICAgbWFuaWZlc3Q6IGV4dGVuc2lvbk1hbmlmZXN0IGFzIE1hbmlmZXN0VjNFeHBvcnQsXG4gICAgICBjb250ZW50U2NyaXB0czoge1xuICAgICAgICBpbmplY3RDc3M6IHRydWUsXG4gICAgICB9LFxuICAgIH0pLFxuICAgIHN0cmlwRGV2SWNvbnMoaXNEZXYpLFxuICBdLFxuICBwdWJsaWNEaXIsXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyLFxuICAgIHNvdXJjZW1hcDogaXNEZXYsXG4gICAgZW1wdHlPdXREaXI6ICFpc0RldixcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBpbnB1dDoge1xuICAgICAgICBwb3B1cDogXCJzcmMvcGFnZXMvcG9wdXAvaW5kZXguaHRtbFwiLFxuICAgICAgICByZW1pbmRlcjogXCJzcmMvcGFnZXMvcmVtaW5kZXIvaW5kZXguaHRtbFwiLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iLCAie1xuICBcIm1hbmlmZXN0X3ZlcnNpb25cIjogMyxcbiAgXCJuYW1lXCI6IFwiU3VwZXIgdGFza3NcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkFkZHMgcG9pbnRzIHRvIEdvb2dsZSBUYXNrc1wiLFxuICBcIm9hdXRoMlwiOiB7XG4gICAgXCJjbGllbnRfaWRcIjogXCI4NzUzMjM2MjU5NzMtcGNkaWc5ZmpycTRsOWVydDI2Zjc0YW5xYTRnZmI4NGQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb21cIixcbiAgICBcInNjb3Blc1wiOiBbXG4gICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvdXNlcmluZm8uZW1haWxcIixcbiAgICAgIFwiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC90YXNrc1wiLFxuICAgICAgXCJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL2NhbGVuZGFyXCIsXG4gICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvY2FsZW5kYXIuZXZlbnRzXCJcbiAgICBdXG4gIH0sXG4gIFwib3B0aW9uc191aVwiOiB7XG4gICAgXCJwYWdlXCI6IFwic3JjL3BhZ2VzL29wdGlvbnMvaW5kZXguaHRtbFwiXG4gIH0sXG4gIFwiYmFja2dyb3VuZFwiOiB7XG4gICAgXCJzZXJ2aWNlX3dvcmtlclwiOiBcInNyYy9wYWdlcy9iYWNrZ3JvdW5kL2luZGV4LnRzXCIsXG4gICAgXCJ0eXBlXCI6IFwibW9kdWxlXCJcbiAgfSxcbiAgXCJhY3Rpb25cIjoge1xuICAgIFwiZGVmYXVsdF9wb3B1cFwiOiBcInNyYy9wYWdlcy9wb3B1cC9pbmRleC5odG1sXCIsXG4gICAgXCJkZWZhdWx0X2ljb25cIjoge1xuICAgICAgXCIzMlwiOiBcImljb24tMzIucG5nXCJcbiAgICB9XG4gIH0sXG4gIFwiaWNvbnNcIjoge1xuICAgIFwiMTI4XCI6IFwiaWNvbi0xMjgucG5nXCJcbiAgfSxcbiAgXCJwZXJtaXNzaW9uc1wiOiBbXCJhY3RpdmVUYWJcIiwgXCJ0YWJzXCIsIFwic3RvcmFnZVwiLCBcImlkZW50aXR5XCIsIFwiYWxhcm1zXCIsIFwibm90aWZpY2F0aW9uc1wiLCBcInN5c3RlbS5kaXNwbGF5XCJdLFxuICBcImNocm9tZV91cmxfb3ZlcnJpZGVzXCI6IHsgXCJuZXd0YWJcIjogXCJzcmMvcGFnZXMvbmV3dGFiL2luZGV4Lmh0bWxcIiB9LFxuICBcImNvbnRlbnRfc2NyaXB0c1wiOiBbXG4gICAge1xuICAgICAgXCJtYXRjaGVzXCI6IFtcImh0dHA6Ly8qLypcIiwgXCJodHRwczovLyovKlwiLCBcIjxhbGxfdXJscz5cIl0sXG4gICAgICBcImpzXCI6IFtcInNyYy9wYWdlcy9jb250ZW50L2luZGV4LnRzeFwiXSxcbiAgICAgIFwiY3NzXCI6IFtcImNvbnRlbnRTdHlsZS5jc3NcIl1cbiAgICB9XG4gIF0sXG4gIFwiZGV2dG9vbHNfcGFnZVwiOiBcInNyYy9wYWdlcy9kZXZ0b29scy9pbmRleC5odG1sXCIsXG4gIFwid2ViX2FjY2Vzc2libGVfcmVzb3VyY2VzXCI6IFtcbiAgICB7XG4gICAgICBcInJlc291cmNlc1wiOiBbXCJjb250ZW50U3R5bGUuY3NzXCIsIFwiaWNvbi0xMjgucG5nXCIsIFwiaWNvbi0zMi5wbmdcIl0sXG4gICAgICBcIm1hdGNoZXNcIjogW11cbiAgICB9XG4gIF1cbn1cbiIsICJ7XG4gIFwia2V5XCI6IFwiTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUFpdUtyMzRLMzdqczlETDhBbGRqeHB6RjQ1eWJrSEN5M3RLdXpRQVp0ZmVWV0U0TEF2OURpV1pLditTVjBCUWJJRUtmZzR1NTducjl1UFFpdm5yalc4YlhLWG92S1FQUHliTHM1RnZxY0pCWHZtWmt5SEZ1U0FNd05aTDBndzFVcE5aWjkwV292SEliVjJ1YlpPa2xFUm9JdUUrbEYwSHcwd09UQlJETVpBVzRqNGZzTXp6L05GTW9OUTVKWG8xVHRHZTM0UllxQ1YwQ2NPMFkzdnRhd2NheXdjNVROWTYrMllZaTlWQUFoK1BTc2NYcHRHaHlEbjNnZHB4UnBLaUU0RDFKb2xhWExGOHIra2Z0OTFRRnVtNHo3OUtYbUlPY1NmTUFoVmduREg3S3F4NWl2QVNQR3U5NDBvU05DZEN3dTNEWm9pUklIRWNHeEltamllTUoydHdJREFRQUJcIixcbiAgXCJhY3Rpb25cIjoge1xuICAgIFwiZGVmYXVsdF9wb3B1cFwiOiBcInNyYy9wYWdlcy9wb3B1cC9pbmRleC5odG1sXCIsXG4gICAgXCJkZWZhdWx0X2ljb25cIjogXCJwdWJsaWMvZGV2LWljb24tMzIucG5nXCJcbiAgfSxcbiAgXCJpY29uc1wiOiB7XG4gICAgXCIxMjhcIjogXCJwdWJsaWMvZGV2LWljb24tMTI4LnBuZ1wiXG4gIH0sXG4gIFwid2ViX2FjY2Vzc2libGVfcmVzb3VyY2VzXCI6IFtcbiAgICB7XG4gICAgICBcInJlc291cmNlc1wiOiBbXCJjb250ZW50U3R5bGUuY3NzXCIsIFwiZGV2LWljb24tMTI4LnBuZ1wiLCBcImRldi1pY29uLTMyLnBuZ1wiXSxcbiAgICAgIFwibWF0Y2hlc1wiOiBbXVxuICAgIH1cbiAgXVxufVxuIiwgIntcbiAgXCJuYW1lXCI6IFwidml0ZS13ZWItZXh0ZW5zaW9uXCIsXG4gIFwidmVyc2lvblwiOiBcIjEuMS4wXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJBIHNpbXBsZSBjaHJvbWUgZXh0ZW5zaW9uIHRlbXBsYXRlIHdpdGggVml0ZSwgUmVhY3QsIFR5cGVTY3JpcHQgYW5kIFRhaWx3aW5kIENTUy5cIixcbiAgXCJsaWNlbnNlXCI6IFwiTUlUXCIsXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vSm9obkJyYS93ZWItZXh0ZW5zaW9uLmdpdFwiXG4gIH0sXG4gIFwic2NyaXB0c1wiOiB7XG4gICAgXCJidWlsZFwiOiBcInZpdGUgYnVpbGRcIixcbiAgICBcImRldlwiOiBcIm5vZGVtb25cIlxuICB9LFxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGRuZC1raXQvY29yZVwiOiBcIl42LjEuMFwiLFxuICAgIFwiQGRuZC1raXQvc29ydGFibGVcIjogXCJeOC4wLjBcIixcbiAgICBcIkBkbmQta2l0L3V0aWxpdGllc1wiOiBcIl4zLjIuMlwiLFxuICAgIFwiQGVtb3Rpb24vcmVhY3RcIjogXCJeMTEuMTEuM1wiLFxuICAgIFwiQGVtb3Rpb24vc3R5bGVkXCI6IFwiXjExLjExLjBcIixcbiAgICBcIkBmb250c291cmNlL3JvYm90b1wiOiBcIl41LjAuOFwiLFxuICAgIFwiQG11aS9pY29ucy1tYXRlcmlhbFwiOiBcIl41LjE1LjEwXCIsXG4gICAgXCJAbXVpL2xhYlwiOiBcIl41LjAuMC1hbHBoYS4xNzBcIixcbiAgICBcIkBtdWkvbWF0ZXJpYWxcIjogXCJeNS4xNS4xMFwiLFxuICAgIFwiQG11aS94LWRhdGUtcGlja2Vyc1wiOiBcIl43LjIuMFwiLFxuICAgIFwiQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5XCI6IFwiXjUuMjIuMlwiLFxuICAgIFwiYXhpb3NcIjogXCJeMS42LjdcIixcbiAgICBcImRheWpzXCI6IFwiXjEuMTEuMTBcIixcbiAgICBcInJlYWN0XCI6IFwiXjE4LjIuMFwiLFxuICAgIFwicmVhY3QtZG9tXCI6IFwiXjE4LjIuMFwiLFxuICAgIFwicmVhY3QtaG9vay1mb3JtXCI6IFwiXjcuNTAuMVwiLFxuICAgIFwicnJ1bGVcIjogXCJeMi44LjFcIixcbiAgICBcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiOiBcIl4wLjEwLjBcIlxuICB9LFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAY3J4anMvdml0ZS1wbHVnaW5cIjogXCJeMS4wLjE0XCIsXG4gICAgXCJAdGFuc3RhY2svZXNsaW50LXBsdWdpbi1xdWVyeVwiOiBcIl41LjE4LjFcIixcbiAgICBcIkB0eXBlcy9jaHJvbWVcIjogXCJeMC4wLjI1M1wiLFxuICAgIFwiQHR5cGVzL25vZGVcIjogXCJeMTguMTcuMVwiLFxuICAgIFwiQHR5cGVzL3JlYWN0XCI6IFwiXjE4LjIuMzlcIixcbiAgICBcIkB0eXBlcy9yZWFjdC1kb21cIjogXCJeMTguMi4xN1wiLFxuICAgIFwiQHR5cGVzL3dlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiOiBcIl4wLjEwLjBcIixcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9lc2xpbnQtcGx1Z2luXCI6IFwiXjUuNDkuMFwiLFxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L3BhcnNlclwiOiBcIl41LjQ5LjBcIixcbiAgICBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiOiBcIl4zLjAuMVwiLFxuICAgIFwiYXV0b3ByZWZpeGVyXCI6IFwiXjEwLjQuMTZcIixcbiAgICBcImVzbGludFwiOiBcIl44LjMyLjBcIixcbiAgICBcImVzbGludC1jb25maWctcHJldHRpZXJcIjogXCJeOC42LjBcIixcbiAgICBcImVzbGludC1wbHVnaW4taW1wb3J0XCI6IFwiXjIuMjcuNVwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1qc3gtYTExeVwiOiBcIl42LjcuMVwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1yZWFjdFwiOiBcIl43LjMyLjFcIixcbiAgICBcImVzbGludC1wbHVnaW4tcmVhY3QtaG9va3NcIjogXCJeNC4zLjBcIixcbiAgICBcImZzLWV4dHJhXCI6IFwiXjExLjEuMFwiLFxuICAgIFwibm9kZW1vblwiOiBcIl4yLjAuMjBcIixcbiAgICBcInBvc3Rjc3NcIjogXCJeOC40LjMxXCIsXG4gICAgXCJ0YWlsd2luZGNzc1wiOiBcIl4zLjMuNVwiLFxuICAgIFwidHMtbm9kZVwiOiBcIl4xMC45LjFcIixcbiAgICBcInR5cGVzY3JpcHRcIjogXCJeNC45LjRcIixcbiAgICBcInZpdGVcIjogXCJeNC41LjBcIlxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZQLE9BQU8sV0FBVztBQUMvUSxTQUFTLGVBQWU7QUFDeEIsT0FBTyxRQUFRO0FBQ2YsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxXQUE2Qjs7O0FDSnRDO0FBQUEsRUFDRSxrQkFBb0I7QUFBQSxFQUNwQixNQUFRO0FBQUEsRUFDUixhQUFlO0FBQUEsRUFDZixRQUFVO0FBQUEsSUFDUixXQUFhO0FBQUEsSUFDYixRQUFVO0FBQUEsTUFDUjtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxZQUFjO0FBQUEsSUFDWixNQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsWUFBYztBQUFBLElBQ1osZ0JBQWtCO0FBQUEs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LFlBQVksUUFBUSxNQUFNLFFBQVE7QUFDeEMsSUFBTSxTQUFTLFFBQVEsa0NBQVcsTUFBTTtBQUN4QyxJQUFNLFlBQVksUUFBUSxrQ0FBVyxRQUFRO0FBRTdDLElBQU0sUUFBUSxRQUFRLElBQUksWUFBWTtBQUV0QyxJQUFNLG9CQUFvQjtBQUFBLEVBQ3hCLEdBQUc7QUFBQSxFQUNILEdBQUksUUFBUSx1QkFBZSxDQUFDO0FBQUEsRUFDNUIsTUFBTSxRQUFRLFFBQVEsaUJBQVMsSUFBSSxLQUFLLGlCQUFTO0FBQUEsRUFDakQsU0FBUyxnQkFBSTtBQUNmO0FBR0EsU0FBUyxjQUFjLE9BQWdCO0FBQ3JDLE1BQUk7QUFBTyxXQUFPO0FBRWxCLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLFVBQVUsUUFBZ0I7QUFDeEIsYUFBTyxXQUFXLG1CQUFtQixTQUFTO0FBQUEsSUFDaEQ7QUFBQSxJQUNBLFlBQVksZUFBb0IsY0FBbUI7QUFDakQsWUFBTUEsVUFBUyxjQUFjO0FBQzdCLFNBQUc7QUFBQSxRQUFHLFFBQVFBLFNBQVEsaUJBQWlCO0FBQUEsUUFBRyxNQUN4QyxRQUFRLElBQUksd0NBQXdDO0FBQUEsTUFDdEQ7QUFDQSxTQUFHO0FBQUEsUUFBRyxRQUFRQSxTQUFRLGtCQUFrQjtBQUFBLFFBQUcsTUFDekMsUUFBUSxJQUFJLHlDQUF5QztBQUFBLE1BQ3ZEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRjtBQUVBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxNQUNSLFdBQVc7QUFBQSxNQUNYLFVBQVU7QUFBQSxJQUNaO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sSUFBSTtBQUFBLE1BQ0YsVUFBVTtBQUFBLE1BQ1YsZ0JBQWdCO0FBQUEsUUFDZCxXQUFXO0FBQUEsTUFDYjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsY0FBYyxLQUFLO0FBQUEsRUFDckI7QUFBQSxFQUNBO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTDtBQUFBLElBQ0EsV0FBVztBQUFBLElBQ1gsYUFBYSxDQUFDO0FBQUEsSUFDZCxlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxPQUFPO0FBQUEsUUFDUCxVQUFVO0FBQUEsTUFDWjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsib3V0RGlyIl0KfQo=
