import type { ViteCustomizableConfig } from "@solidjs/start/config";

export const assetsIgnorePlugin = (): NonNullable<
  ViteCustomizableConfig["plugins"]
>[0] => {
  return {
    generateBundle() {
      const files = [
        "**/node_modules",
        "**/.DS_Store",
        "**/.git",
        "_worker.js",
      ];

      const result = files.join("/n");

      this.emitFile({
        fileName: ".assetsignore",
        source: result,
        type: "asset",
      });
    },
    name: "assets-ignore-plugin",
  };
};
