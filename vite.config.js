import fs from "fs";
import { defineConfig, loadEnv, build } from "vite";
import { resolve } from "path";

const entries = {
  background: resolve(__dirname, "src/background/background.ts"),
  content: resolve(__dirname, "src/content/content.ts"),
  option: resolve(__dirname, "src/option/option.ts"),
};

export default defineConfig(async ({ command }) => {
  const env = loadEnv("", process.cwd(), "");

  if (command === "build") {
    const outDir = resolve(__dirname, "dist");

    if (fs.existsSync(outDir)) {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
    fs.mkdirSync(outDir);

    for (const [name, entry] of Object.entries(entries)) {
      await build({
        configFile: false,
        root: "src",
        build: {
          outDir,
          emptyOutDir: false,
          rollupOptions: {
            input: entry,
            output: {
              entryFileNames: `${name}.js`,
              assetFileNames: (assetInfo) => {
                if (assetInfo.name && assetInfo.name.endsWith(".css")) {
                  return `${name}.css`;
                }
                return assetInfo.name;
              },
              inlineDynamicImports: false,
            },
          },
          cssCodeSplit: true,
        },
        /*plugins: [
          {
            name: "css-output",
            generateBundle(options, bundle) {
              for (const fileName in bundle) {
                if (fileName.endsWith(".css")) {
                  this.emitFile({
                    type: "asset",
                    fileName: fileName,
                    source: bundle[fileName].source,
                  });
                }
              }
            },
          },
        ],*/
      });
    }

    const publicDir = resolve(__dirname, "public");
    if (fs.existsSync(publicDir)) {
      fs.cpSync(publicDir, outDir, { recursive: true });
    }

    process.exit(0);
  }

  const config = {
    root: "src",
    build: {
      outDir: "../dist",
      emptyOutDir: true,
    },
    publicDir: "../public",
  };

  if (env.VITE_BASE_PATH !== undefined) {
    config.base = env.VITE_BASE_PATH;
  }

  if (env.VITE_KEY_PATH !== undefined && env.VITE_CERT_PATH !== undefined) {
    config.server = {
      https: {
        key: fs.readFileSync(env.VITE_KEY_PATH),
        cert: fs.readFileSync(env.VITE_CERT_PATH),
      },
    };
  }

  return config;
});
