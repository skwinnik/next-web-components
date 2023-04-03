const WatchExternalFilesPlugin = require("webpack-watch-external-files-plugin");
const { resolve: pathResolve } = require("path");
const { readdirSync } = require("fs");
const log = require("next/dist/build/output/log");

const getWidgets = (path) =>
  readdirSync(path, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

class WidgetsCompilerPlugin {
  constructor(publicRuntimeConfig, webpackConfig, webpack) {
    this.webpack = webpack;
    this.widgets = getWidgets(pathResolve(process.cwd(), "widgets"));
    this.publicBaseURL = publicRuntimeConfig?.PUBLIC_BASE_URL || "";
    this.buildConfig = {
      ...webpackConfig,
      optimization: {
        ...webpackConfig.optimization,
        runtimeChunk: false,
        splitChunks: {
          cacheGroups: {
            widgets: {
              name: "widgets",
              priority: 0,
              chunks: "async",
              enforce: true,
            },
            vendors: {
              name: "vendors",
              priority: 1,
              test: /[\\/]node_modules[\\/]/,
              chunks: "async",
              reuseExistingChunk: true,
            },
          },
        },
      },
      entry: this.widgets.reduce(
        (entries, widgetName) => ({
          ...entries,
          [widgetName]: `./widgets/${widgetName}/index.tsx`,
        }),
        {}
      ),
      output: {
        ...webpackConfig.output,
        publicPath: `${this.publicBaseURL}/_next/`,
        filename: "static/widgets/[name]/index.js",
      },
    };
  }

  apply(compiler) {
    compiler.hooks.beforeCompile.tapPromise("WidgetsCompilerPlugin", () => {
      log.wait("compiling widgets", this.widgets);
      return this.compileWidgets();
    });
  }

  compileWidgets(outputResult = false) {
    return new Promise((resolve, reject) => {
      const compiler = this.webpack(this.buildConfig);
      compiler.run((err, stats) => {
        if (err || stats.hasErrors()) {
          log.error(stats ? stats.toString({ colors: true }) : err);

          // avoid reject in dev mode, because it will cause the whole build to fail and stop the dev server
          if (this.buildConfig.mode === "development")
            return resolve("widget compilation failed");
          return reject("widget compilation failed");
        }

        if (stats.hasWarnings()) {
          log.warn(stats.toString({ colors: true }));
        }

        const elapsedMs = stats.toJson().time;
        const elapsed =
          elapsedMs > 1000
            ? `${(elapsedMs / 1000).toFixed(2)}s`
            : `${elapsedMs}ms`;

        log.ready("compiled widgets successfully in", elapsed);
        if (outputResult) log.info(stats.toString({ colors: true }));
        resolve();
      });
    });
  }
}

const addWidgetCompiler = (nextConfig) => {
  return {
    ...nextConfig,
    webpack: (webpackConfig, options) => {
      const { isServer, webpack } = options;

      if (typeof nextConfig.webpack === "function") {
        webpackConfig = nextConfig.webpack(webpackConfig, options);
      }

      // Do build widgets only during frontend build. NextJS does two builds, one for frontend, one for backend.
      if (isServer) {
        return webpackConfig;
      }

      let additionalPlugins = [
        new WidgetsCompilerPlugin(
          nextConfig.publicRuntimeConfig,
          {
            ...webpackConfig,
          },
          webpack
        ),
      ];

      if (webpackConfig.mode === "development") {
        additionalPlugins.push(
          new WatchExternalFilesPlugin({
            files: ["./widgets/**/*"],
          })
        );
      }

      return {
        ...webpackConfig,
        plugins: [...webpackConfig.plugins, ...additionalPlugins],
      };
    },
  };
};

module.exports = {
  addWidgetCompiler,
};
