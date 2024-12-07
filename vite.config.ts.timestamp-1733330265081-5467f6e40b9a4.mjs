// vite.config.ts
import react from "file:///home/work/code/super-tasks/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { resolve } from "path";
import fs from "fs";
import { defineConfig } from "file:///home/work/code/super-tasks/node_modules/vite/dist/node/index.js";
import { crx } from "file:///home/work/code/super-tasks/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// manifest.json
var manifest_default = {
  manifest_version: 3,
  name: "Axess",
  description: "Axess your daily tools from any tab!",
  oauth2: {
    client_id: "567438855699-4vafg2ckks5ik6uvdbeoa2h7rr45a2i3.apps.googleusercontent.com",
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
      "32": "logo_1_32x32_filled.png"
    }
  },
  icons: {
    "128": "logo_1_128x128_filled.png"
  },
  permissions: [
    "activeTab",
    "tabs",
    "storage",
    "identity",
    "openid",
    "identity.email",
    "alarms",
    "notifications",
    "system.display"
  ],
  "//chrome_url_overrides": { newtab: "src/pages/newtab/index.html" },
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
        "google-tasks-icon.png",
        "chatgpt-icon.png",
        "logo_1_128x128.png",
        "logo_1_32x32.png"
      ],
      matches: ["<all_urls>"]
    }
  ]
};

// manifest.dev.json
var manifest_dev_default = {
  key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0FpsQRsXM8ly6nnw+qYoO7gt8YHW8V2x1soklp3CgeHNhvvLL2LPM5ewfa+jo4m/UC3gFiryIoflbYJqVpdu4edo8Z1PuLRU7nSQLTTtWtptqNula/2lzF1RkIZHR61X0CLjSQ2z93qGe12Iipa01U9w7Xg8q0uFyOZfhpIgidm+lWOwHm36nTJeBRKXLXUn+/Dl5Y72RftxgQkRjAEKGwAPf1d92nGUw8Zw+dO92kipjM0Q3x0yKmoK3KbCwP3TI6AvAcQ3L7Y8FAlZ42AmSLjlNY90wIebNeJPiZ+XM1abfKDPKJkMsQk+UAbgsxooBaOvL/xaPxqoeFHylSkgtQIDAQAB",
  action: {
    default_popup: "src/pages/popup/index.html"
  },
  web_accessible_resources: [
    {
      resources: [
        "contentStyle.css",
        "google-tasks-icon.png",
        "chatgpt-icon.png",
        "logo_1_128x128.png",
        "logo_1_32x32.png"
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
    "@crxjs/vite-plugin": "^2.0.0-beta.26",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAibWFuaWZlc3QuanNvbiIsICJtYW5pZmVzdC5kZXYuanNvbiIsICJwYWNrYWdlLmpzb24iXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS93b3JrL2NvZGUvc3VwZXItdGFza3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3dvcmsvY29kZS9zdXBlci10YXNrcy92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS93b3JrL2NvZGUvc3VwZXItdGFza3Mvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgY3J4LCBNYW5pZmVzdFYzRXhwb3J0IH0gZnJvbSBcIkBjcnhqcy92aXRlLXBsdWdpblwiO1xuXG5pbXBvcnQgbWFuaWZlc3QgZnJvbSBcIi4vbWFuaWZlc3QuanNvblwiO1xuaW1wb3J0IGRldk1hbmlmZXN0IGZyb20gXCIuL21hbmlmZXN0LmRldi5qc29uXCI7XG5pbXBvcnQgcGtnIGZyb20gXCIuL3BhY2thZ2UuanNvblwiO1xuXG5jb25zdCByb290ID0gcmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjXCIpO1xuY29uc3QgcGFnZXNEaXIgPSByZXNvbHZlKHJvb3QsIFwicGFnZXNcIik7XG5jb25zdCBhc3NldHNEaXIgPSByZXNvbHZlKHJvb3QsIFwiYXNzZXRzXCIpO1xuY29uc3Qgb3V0RGlyID0gcmVzb2x2ZShfX2Rpcm5hbWUsIFwiZGlzdFwiKTtcbmNvbnN0IHB1YmxpY0RpciA9IHJlc29sdmUoX19kaXJuYW1lLCBcInB1YmxpY1wiKTtcblxuY29uc3QgaXNEZXYgPSBwcm9jZXNzLmVudi5fX0RFVl9fID09PSBcInRydWVcIjtcblxuY29uc3QgZXh0ZW5zaW9uTWFuaWZlc3QgPSB7XG4gIC4uLm1hbmlmZXN0LFxuICAuLi4oaXNEZXYgPyBkZXZNYW5pZmVzdCA6ICh7fSBhcyBNYW5pZmVzdFYzRXhwb3J0KSksXG4gIG5hbWU6IGlzRGV2ID8gYERFVjogJHttYW5pZmVzdC5uYW1lfWAgOiBtYW5pZmVzdC5uYW1lLFxuICB2ZXJzaW9uOiBwa2cudmVyc2lvbixcbn07XG5cbi8vIHBsdWdpbiB0byByZW1vdmUgZGV2IGljb25zIGZyb20gcHJvZCBidWlsZFxuZnVuY3Rpb24gc3RyaXBEZXZJY29ucyhhcHBseTogYm9vbGVhbikge1xuICBpZiAoYXBwbHkpIHJldHVybiBudWxsO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogXCJzdHJpcC1kZXYtaWNvbnNcIixcbiAgICByZXNvbHZlSWQoc291cmNlOiBzdHJpbmcpIHtcbiAgICAgIHJldHVybiBzb3VyY2UgPT09IFwidmlydHVhbC1tb2R1bGVcIiA/IHNvdXJjZSA6IG51bGw7XG4gICAgfSxcbiAgICByZW5kZXJTdGFydChvdXRwdXRPcHRpb25zOiBhbnksIGlucHV0T3B0aW9uczogYW55KSB7XG4gICAgICBjb25zdCBvdXREaXIgPSBvdXRwdXRPcHRpb25zLmRpcjtcbiAgICAgIGZzLnJtKHJlc29sdmUob3V0RGlyLCBcImRldi1pY29uLTMyLnBuZ1wiKSwgKCkgPT5cbiAgICAgICAgY29uc29sZS5sb2coYERlbGV0ZWQgZGV2LWljb24tMzIucG5nIGZybSBwcm9kIGJ1aWxkYClcbiAgICAgICk7XG4gICAgICBmcy5ybShyZXNvbHZlKG91dERpciwgXCJkZXYtaWNvbi0xMjgucG5nXCIpLCAoKSA9PlxuICAgICAgICBjb25zb2xlLmxvZyhgRGVsZXRlZCBkZXYtaWNvbi0xMjgucG5nIGZybSBwcm9kIGJ1aWxkYClcbiAgICAgICk7XG4gICAgfSxcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBzcmNcIjogcm9vdCxcbiAgICAgIFwiQGFzc2V0c1wiOiBhc3NldHNEaXIsXG4gICAgICBcIkBwYWdlc1wiOiBwYWdlc0RpcixcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBjcngoe1xuICAgICAgbWFuaWZlc3Q6IGV4dGVuc2lvbk1hbmlmZXN0IGFzIE1hbmlmZXN0VjNFeHBvcnQsXG4gICAgICBjb250ZW50U2NyaXB0czoge1xuICAgICAgICBpbmplY3RDc3M6IHRydWUsXG4gICAgICB9LFxuICAgIH0pLFxuICAgIHN0cmlwRGV2SWNvbnMoaXNEZXYpLFxuICBdLFxuICBwdWJsaWNEaXIsXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyLFxuICAgIHNvdXJjZW1hcDogaXNEZXYsXG4gICAgZW1wdHlPdXREaXI6ICFpc0RldixcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBpbnB1dDoge1xuICAgICAgICBwb3B1cDogXCJzcmMvcGFnZXMvcG9wdXAvaW5kZXguaHRtbFwiLFxuICAgICAgICByZW1pbmRlcjogXCJzcmMvcGFnZXMvcmVtaW5kZXIvaW5kZXguaHRtbFwiLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iLCAie1xuICBcIm1hbmlmZXN0X3ZlcnNpb25cIjogMyxcbiAgXCJuYW1lXCI6IFwiQXhlc3NcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkF4ZXNzIHlvdXIgZGFpbHkgdG9vbHMgZnJvbSBhbnkgdGFiIVwiLFxuICBcIm9hdXRoMlwiOiB7XG4gICAgXCJjbGllbnRfaWRcIjogXCI1Njc0Mzg4NTU2OTktNHZhZmcyY2trczVpazZ1dmRiZW9hMmg3cnI0NWEyaTMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb21cIixcbiAgICBcInNjb3Blc1wiOiBbXG4gICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvdXNlcmluZm8uZW1haWxcIixcbiAgICAgIFwiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC90YXNrc1wiLFxuICAgICAgXCJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL2NhbGVuZGFyXCIsXG4gICAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvY2FsZW5kYXIuZXZlbnRzXCJcbiAgICBdXG4gIH0sXG4gIFwib3B0aW9uc191aVwiOiB7XG4gICAgXCJwYWdlXCI6IFwic3JjL3BhZ2VzL29wdGlvbnMvaW5kZXguaHRtbFwiXG4gIH0sXG4gIFwiYmFja2dyb3VuZFwiOiB7XG4gICAgXCJzZXJ2aWNlX3dvcmtlclwiOiBcInNyYy9wYWdlcy9iYWNrZ3JvdW5kL2luZGV4LnRzXCIsXG4gICAgXCJ0eXBlXCI6IFwibW9kdWxlXCJcbiAgfSxcbiAgXCJhY3Rpb25cIjoge1xuICAgIFwiZGVmYXVsdF9wb3B1cFwiOiBcInNyYy9wYWdlcy9wb3B1cC9pbmRleC5odG1sXCIsXG4gICAgXCJkZWZhdWx0X2ljb25cIjoge1xuICAgICAgXCIzMlwiOiBcImxvZ29fMV8zMngzMl9maWxsZWQucG5nXCJcbiAgICB9XG4gIH0sXG4gIFwiaWNvbnNcIjoge1xuICAgIFwiMTI4XCI6IFwibG9nb18xXzEyOHgxMjhfZmlsbGVkLnBuZ1wiXG4gIH0sXG4gIFwicGVybWlzc2lvbnNcIjogW1xuICAgIFwiYWN0aXZlVGFiXCIsXG4gICAgXCJ0YWJzXCIsXG4gICAgXCJzdG9yYWdlXCIsXG4gICAgXCJpZGVudGl0eVwiLFxuICAgIFwib3BlbmlkXCIsXG4gICAgXCJpZGVudGl0eS5lbWFpbFwiLFxuICAgIFwiYWxhcm1zXCIsXG4gICAgXCJub3RpZmljYXRpb25zXCIsXG4gICAgXCJzeXN0ZW0uZGlzcGxheVwiXG4gIF0sXG4gIFwiLy9jaHJvbWVfdXJsX292ZXJyaWRlc1wiOiB7IFwibmV3dGFiXCI6IFwic3JjL3BhZ2VzL25ld3RhYi9pbmRleC5odG1sXCIgfSxcbiAgXCJjb250ZW50X3NjcmlwdHNcIjogW1xuICAgIHtcbiAgICAgIFwibWF0Y2hlc1wiOiBbXCJodHRwOi8vKi8qXCIsIFwiaHR0cHM6Ly8qLypcIiwgXCI8YWxsX3VybHM+XCJdLFxuICAgICAgXCJqc1wiOiBbXCJzcmMvcGFnZXMvY29udGVudC9pbmRleC50c3hcIl0sXG4gICAgICBcImNzc1wiOiBbXCJjb250ZW50U3R5bGUuY3NzXCJdXG4gICAgfVxuICBdLFxuICBcImRldnRvb2xzX3BhZ2VcIjogXCJzcmMvcGFnZXMvZGV2dG9vbHMvaW5kZXguaHRtbFwiLFxuICBcIndlYl9hY2Nlc3NpYmxlX3Jlc291cmNlc1wiOiBbXG4gICAge1xuICAgICAgXCJyZXNvdXJjZXNcIjogW1xuICAgICAgICBcImNvbnRlbnRTdHlsZS5jc3NcIixcbiAgICAgICAgXCJnb29nbGUtdGFza3MtaWNvbi5wbmdcIixcbiAgICAgICAgXCJjaGF0Z3B0LWljb24ucG5nXCIsXG4gICAgICAgIFwibG9nb18xXzEyOHgxMjgucG5nXCIsXG4gICAgICAgIFwibG9nb18xXzMyeDMyLnBuZ1wiXG4gICAgICBdLFxuICAgICAgXCJtYXRjaGVzXCI6IFtcIjxhbGxfdXJscz5cIl1cbiAgICB9XG4gIF1cbn1cbiIsICJ7XG4gIFwia2V5XCI6IFwiTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUEwRnBzUVJzWE04bHk2bm53K3FZb083Z3Q4WUhXOFYyeDFzb2tscDNDZ2VITmh2dkxMMkxQTTVld2ZhK2pvNG0vVUMzZ0ZpcnlJb2ZsYllKcVZwZHU0ZWRvOFoxUHVMUlU3blNRTFRUdFd0cHRxTnVsYS8ybHpGMVJrSVpIUjYxWDBDTGpTUTJ6OTNxR2UxMklpcGEwMVU5dzdYZzhxMHVGeU9aZmhwSWdpZG0rbFdPd0htMzZuVEplQlJLWExYVW4rL0RsNVk3MlJmdHhnUWtSakFFS0d3QVBmMWQ5Mm5HVXc4WncrZE85MmtpcGpNMFEzeDB5S21vSzNLYkN3UDNUSTZBdkFjUTNMN1k4RkFsWjQyQW1TTGpsTlk5MHdJZWJOZUpQaVorWE0xYWJmS0RQS0prTXNRaytVQWJnc3hvb0JhT3ZML3hhUHhxb2VGSHlsU2tndFFJREFRQUJcIixcbiAgXCJhY3Rpb25cIjoge1xuICAgIFwiZGVmYXVsdF9wb3B1cFwiOiBcInNyYy9wYWdlcy9wb3B1cC9pbmRleC5odG1sXCJcbiAgfSxcbiAgXCJ3ZWJfYWNjZXNzaWJsZV9yZXNvdXJjZXNcIjogW1xuICAgIHtcbiAgICAgIFwicmVzb3VyY2VzXCI6IFtcbiAgICAgICAgXCJjb250ZW50U3R5bGUuY3NzXCIsXG4gICAgICAgIFwiZ29vZ2xlLXRhc2tzLWljb24ucG5nXCIsXG4gICAgICAgIFwiY2hhdGdwdC1pY29uLnBuZ1wiLFxuICAgICAgICBcImxvZ29fMV8xMjh4MTI4LnBuZ1wiLFxuICAgICAgICBcImxvZ29fMV8zMngzMi5wbmdcIlxuICAgICAgXSxcbiAgICAgIFwibWF0Y2hlc1wiOiBbXCI8YWxsX3VybHM+XCJdXG4gICAgfVxuICBdXG59XG4iLCAie1xuICBcIm5hbWVcIjogXCJ2aXRlLXdlYi1leHRlbnNpb25cIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4xLjBcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkEgc2ltcGxlIGNocm9tZSBleHRlbnNpb24gdGVtcGxhdGUgd2l0aCBWaXRlLCBSZWFjdCwgVHlwZVNjcmlwdCBhbmQgVGFpbHdpbmQgQ1NTLlwiLFxuICBcImxpY2Vuc2VcIjogXCJNSVRcIixcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9Kb2huQnJhL3dlYi1leHRlbnNpb24uZ2l0XCJcbiAgfSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImJ1aWxkXCI6IFwidml0ZSBidWlsZFwiLFxuICAgIFwiZGV2XCI6IFwibm9kZW1vblwiXG4gIH0sXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAZG5kLWtpdC9jb3JlXCI6IFwiXjYuMS4wXCIsXG4gICAgXCJAZG5kLWtpdC9zb3J0YWJsZVwiOiBcIl44LjAuMFwiLFxuICAgIFwiQGRuZC1raXQvdXRpbGl0aWVzXCI6IFwiXjMuMi4yXCIsXG4gICAgXCJAZW1vdGlvbi9yZWFjdFwiOiBcIl4xMS4xMS4zXCIsXG4gICAgXCJAZW1vdGlvbi9zdHlsZWRcIjogXCJeMTEuMTEuMFwiLFxuICAgIFwiQGZvbnRzb3VyY2Uvcm9ib3RvXCI6IFwiXjUuMC44XCIsXG4gICAgXCJAbXVpL2Jhc2VcIjogXCJeNS4wLjAtYmV0YS41OVwiLFxuICAgIFwiQG11aS9pY29ucy1tYXRlcmlhbFwiOiBcIl41LjE1LjEwXCIsXG4gICAgXCJAbXVpL2xhYlwiOiBcIl41LjAuMC1hbHBoYS4xNzBcIixcbiAgICBcIkBtdWkvbWF0ZXJpYWxcIjogXCJeNS4xNS4xMFwiLFxuICAgIFwiQG11aS94LWRhdGUtcGlja2Vyc1wiOiBcIl43LjIuMFwiLFxuICAgIFwiQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5XCI6IFwiXjUuMjIuMlwiLFxuICAgIFwiQHR5cGVzL3JlYWN0LXN5bnRheC1oaWdobGlnaHRlclwiOiBcIl4xNS41LjEzXCIsXG4gICAgXCJheGlvc1wiOiBcIl4xLjYuN1wiLFxuICAgIFwiZGF5anNcIjogXCJeMS4xMS4xMFwiLFxuICAgIFwicmVhY3RcIjogXCJeMTguMi4wXCIsXG4gICAgXCJyZWFjdC1kb21cIjogXCJeMTguMi4wXCIsXG4gICAgXCJyZWFjdC1ob29rLWZvcm1cIjogXCJeNy41MC4xXCIsXG4gICAgXCJyZWFjdC1tYXJrZG93blwiOiBcIl45LjAuMVwiLFxuICAgIFwicmVhY3Qtc3ludGF4LWhpZ2hsaWdodGVyXCI6IFwiXjE1LjYuMVwiLFxuICAgIFwicnJ1bGVcIjogXCJeMi44LjFcIixcbiAgICBcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiOiBcIl4wLjEwLjBcIlxuICB9LFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAY3J4anMvdml0ZS1wbHVnaW5cIjogXCJeMi4wLjAtYmV0YS4yNlwiLFxuICAgIFwiQHRhbnN0YWNrL2VzbGludC1wbHVnaW4tcXVlcnlcIjogXCJeNS4xOC4xXCIsXG4gICAgXCJAdHlwZXMvY2hyb21lXCI6IFwiXjAuMC4yNTNcIixcbiAgICBcIkB0eXBlcy9ub2RlXCI6IFwiXjE4LjE3LjFcIixcbiAgICBcIkB0eXBlcy9yZWFjdFwiOiBcIl4xOC4yLjM5XCIsXG4gICAgXCJAdHlwZXMvcmVhY3QtZG9tXCI6IFwiXjE4LjIuMTdcIixcbiAgICBcIkB0eXBlcy93ZWJleHRlbnNpb24tcG9seWZpbGxcIjogXCJeMC4xMC4wXCIsXG4gICAgXCJAdHlwZXNjcmlwdC1lc2xpbnQvZXNsaW50LXBsdWdpblwiOiBcIl41LjQ5LjBcIixcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9wYXJzZXJcIjogXCJeNS40OS4wXCIsXG4gICAgXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjogXCJeMy4wLjFcIixcbiAgICBcImF1dG9wcmVmaXhlclwiOiBcIl4xMC40LjE2XCIsXG4gICAgXCJlc2xpbnRcIjogXCJeOC4zMi4wXCIsXG4gICAgXCJlc2xpbnQtY29uZmlnLXByZXR0aWVyXCI6IFwiXjguNi4wXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLWltcG9ydFwiOiBcIl4yLjI3LjVcIixcbiAgICBcImVzbGludC1wbHVnaW4tanN4LWExMXlcIjogXCJeNi43LjFcIixcbiAgICBcImVzbGludC1wbHVnaW4tcmVhY3RcIjogXCJeNy4zMi4xXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXJlYWN0LWhvb2tzXCI6IFwiXjQuMy4wXCIsXG4gICAgXCJmcy1leHRyYVwiOiBcIl4xMS4xLjBcIixcbiAgICBcIm5vZGVtb25cIjogXCJeMi4wLjIwXCIsXG4gICAgXCJwb3N0Y3NzXCI6IFwiXjguNC4zMVwiLFxuICAgIFwidGFpbHdpbmRjc3NcIjogXCJeMy4zLjVcIixcbiAgICBcInRzLW5vZGVcIjogXCJeMTAuOS4xXCIsXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwiXjQuOS40XCIsXG4gICAgXCJ2aXRlXCI6IFwiXjQuNS4wXCJcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtUSxPQUFPLFdBQVc7QUFDclIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sUUFBUTtBQUNmLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsV0FBNkI7OztBQ0p0QztBQUFBLEVBQ0Usa0JBQW9CO0FBQUEsRUFDcEIsTUFBUTtBQUFBLEVBQ1IsYUFBZTtBQUFBLEVBQ2YsUUFBVTtBQUFBLElBQ1IsV0FBYTtBQUFBLElBQ2IsUUFBVTtBQUFBLE1BQ1I7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsWUFBYztBQUFBLElBQ1osTUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLFlBQWM7QUFBQSxJQUNaLGdCQUFrQjtBQUFBLElBQ2xCLE1BQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxRQUFVO0FBQUEsSUFDUixlQUFpQjtBQUFBLElBQ2pCLGNBQWdCO0FBQUEsTUFDZCxNQUFNO0FBQUEsSUFDUjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxhQUFlO0FBQUEsSUFDYjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUFBLEVBQ0EsMEJBQTBCLEVBQUUsUUFBVSw4QkFBOEI7QUFBQSxFQUNwRSxpQkFBbUI7QUFBQSxJQUNqQjtBQUFBLE1BQ0UsU0FBVyxDQUFDLGNBQWMsZUFBZSxZQUFZO0FBQUEsTUFDckQsSUFBTSxDQUFDLDZCQUE2QjtBQUFBLE1BQ3BDLEtBQU8sQ0FBQyxrQkFBa0I7QUFBQSxJQUM1QjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGVBQWlCO0FBQUEsRUFDakIsMEJBQTRCO0FBQUEsSUFDMUI7QUFBQSxNQUNFLFdBQWE7QUFBQSxRQUNYO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFNBQVcsQ0FBQyxZQUFZO0FBQUEsSUFDMUI7QUFBQSxFQUNGO0FBQ0Y7OztBQzdEQTtBQUFBLEVBQ0UsS0FBTztBQUFBLEVBQ1AsUUFBVTtBQUFBLElBQ1IsZUFBaUI7QUFBQSxFQUNuQjtBQUFBLEVBQ0EsMEJBQTRCO0FBQUEsSUFDMUI7QUFBQSxNQUNFLFdBQWE7QUFBQSxRQUNYO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFNBQVcsQ0FBQyxZQUFZO0FBQUEsSUFDMUI7QUFBQSxFQUNGO0FBQ0Y7OztBQ2pCQTtBQUFBLEVBQ0UsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLEVBQ1gsYUFBZTtBQUFBLEVBQ2YsU0FBVztBQUFBLEVBQ1gsWUFBYztBQUFBLElBQ1osTUFBUTtBQUFBLElBQ1IsS0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBLFNBQVc7QUFBQSxJQUNULE9BQVM7QUFBQSxJQUNULEtBQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxNQUFRO0FBQUEsRUFDUixjQUFnQjtBQUFBLElBQ2QsaUJBQWlCO0FBQUEsSUFDakIscUJBQXFCO0FBQUEsSUFDckIsc0JBQXNCO0FBQUEsSUFDdEIsa0JBQWtCO0FBQUEsSUFDbEIsbUJBQW1CO0FBQUEsSUFDbkIsc0JBQXNCO0FBQUEsSUFDdEIsYUFBYTtBQUFBLElBQ2IsdUJBQXVCO0FBQUEsSUFDdkIsWUFBWTtBQUFBLElBQ1osaUJBQWlCO0FBQUEsSUFDakIsdUJBQXVCO0FBQUEsSUFDdkIseUJBQXlCO0FBQUEsSUFDekIsbUNBQW1DO0FBQUEsSUFDbkMsT0FBUztBQUFBLElBQ1QsT0FBUztBQUFBLElBQ1QsT0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsbUJBQW1CO0FBQUEsSUFDbkIsa0JBQWtCO0FBQUEsSUFDbEIsNEJBQTRCO0FBQUEsSUFDNUIsT0FBUztBQUFBLElBQ1QseUJBQXlCO0FBQUEsRUFDM0I7QUFBQSxFQUNBLGlCQUFtQjtBQUFBLElBQ2pCLHNCQUFzQjtBQUFBLElBQ3RCLGlDQUFpQztBQUFBLElBQ2pDLGlCQUFpQjtBQUFBLElBQ2pCLGVBQWU7QUFBQSxJQUNmLGdCQUFnQjtBQUFBLElBQ2hCLG9CQUFvQjtBQUFBLElBQ3BCLGdDQUFnQztBQUFBLElBQ2hDLG9DQUFvQztBQUFBLElBQ3BDLDZCQUE2QjtBQUFBLElBQzdCLDRCQUE0QjtBQUFBLElBQzVCLGNBQWdCO0FBQUEsSUFDaEIsUUFBVTtBQUFBLElBQ1YsMEJBQTBCO0FBQUEsSUFDMUIsd0JBQXdCO0FBQUEsSUFDeEIsMEJBQTBCO0FBQUEsSUFDMUIsdUJBQXVCO0FBQUEsSUFDdkIsNkJBQTZCO0FBQUEsSUFDN0IsWUFBWTtBQUFBLElBQ1osU0FBVztBQUFBLElBQ1gsU0FBVztBQUFBLElBQ1gsYUFBZTtBQUFBLElBQ2YsV0FBVztBQUFBLElBQ1gsWUFBYztBQUFBLElBQ2QsTUFBUTtBQUFBLEVBQ1Y7QUFDRjs7O0FIaEVBLElBQU0sbUNBQW1DO0FBVXpDLElBQU0sT0FBTyxRQUFRLGtDQUFXLEtBQUs7QUFDckMsSUFBTSxXQUFXLFFBQVEsTUFBTSxPQUFPO0FBQ3RDLElBQU0sWUFBWSxRQUFRLE1BQU0sUUFBUTtBQUN4QyxJQUFNLFNBQVMsUUFBUSxrQ0FBVyxNQUFNO0FBQ3hDLElBQU0sWUFBWSxRQUFRLGtDQUFXLFFBQVE7QUFFN0MsSUFBTSxRQUFRLFFBQVEsSUFBSSxZQUFZO0FBRXRDLElBQU0sb0JBQW9CO0FBQUEsRUFDeEIsR0FBRztBQUFBLEVBQ0gsR0FBSSxRQUFRLHVCQUFlLENBQUM7QUFBQSxFQUM1QixNQUFNLFFBQVEsUUFBUSxpQkFBUyxJQUFJLEtBQUssaUJBQVM7QUFBQSxFQUNqRCxTQUFTLGdCQUFJO0FBQ2Y7QUFHQSxTQUFTLGNBQWMsT0FBZ0I7QUFDckMsTUFBSTtBQUFPLFdBQU87QUFFbEIsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sVUFBVSxRQUFnQjtBQUN4QixhQUFPLFdBQVcsbUJBQW1CLFNBQVM7QUFBQSxJQUNoRDtBQUFBLElBQ0EsWUFBWSxlQUFvQixjQUFtQjtBQUNqRCxZQUFNQSxVQUFTLGNBQWM7QUFDN0IsU0FBRztBQUFBLFFBQUcsUUFBUUEsU0FBUSxpQkFBaUI7QUFBQSxRQUFHLE1BQ3hDLFFBQVEsSUFBSSx3Q0FBd0M7QUFBQSxNQUN0RDtBQUNBLFNBQUc7QUFBQSxRQUFHLFFBQVFBLFNBQVEsa0JBQWtCO0FBQUEsUUFBRyxNQUN6QyxRQUFRLElBQUkseUNBQXlDO0FBQUEsTUFDdkQ7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBRUEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLE1BQ1IsV0FBVztBQUFBLE1BQ1gsVUFBVTtBQUFBLElBQ1o7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixJQUFJO0FBQUEsTUFDRixVQUFVO0FBQUEsTUFDVixnQkFBZ0I7QUFBQSxRQUNkLFdBQVc7QUFBQSxNQUNiO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxjQUFjLEtBQUs7QUFBQSxFQUNyQjtBQUFBLEVBQ0E7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMO0FBQUEsSUFDQSxXQUFXO0FBQUEsSUFDWCxhQUFhLENBQUM7QUFBQSxJQUNkLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxRQUNMLE9BQU87QUFBQSxRQUNQLFVBQVU7QUFBQSxNQUNaO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJvdXREaXIiXQp9Cg==
