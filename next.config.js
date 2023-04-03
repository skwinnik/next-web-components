const { addWidgetCompiler } = require("./webpack-config/widget-compiler");

module.exports = addWidgetCompiler(
  /** @type {import('next').NextConfig} */
  {
    experimental: {
      appDir: true,
    },
  }
);
