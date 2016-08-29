var webpack = require("webpack");
var ConcatSource = require("webpack-sources").ConcatSource;
//var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
var path = require("path");
var CopyWebpackPlugin = require('copy-webpack-plugin');

//HACK: changes the JSONP chunk eval function to `global["nativescriptJsonp"]`
// applied to tns-java-classes.js only
function FixJsonpPlugin(options) {
}

FixJsonpPlugin.prototype.apply = function(compiler) {
    compiler.plugin('compilation', function(compilation, params) {
        compilation.plugin("optimize-chunk-assets", function(chunks, callback) {
            chunks.forEach(function(chunk) {
                chunk.files.forEach(function(file) {
                    if (file === "tns-java-classes.js") {
                        var src = compilation.assets[file];
                        var code = src.source();
                        var match = code.match(/window\["nativescriptJsonp"\]/);
                        if (match) {
                            compilation.assets[file] = new ConcatSource(code.replace(/window\["nativescriptJsonp"\]/g,  "global[\"nativescriptJsonp\"]"));
                        }
                    }
                });
            });
            callback();
        });
    });
};

//HACK: clone webpack-fail-plugin here since it's peerDependencies point to
//webpack 1.x
function FailPlugin() {
  var isWatch = true;

  this.plugin("run", function(compiler, callback) {
    isWatch = false;
    callback.call(compiler);
  });

  this.plugin("done", function(stats) {
    if (stats.compilation.errors && stats.compilation.errors.length && !isWatch) {
      process.on('beforeExit', function() {
        process.exit(1);
      });
    }
  });
}

module.exports = {
    context: path.resolve("./src"),
    entry: {
        "bundle": "./main",
        "tns-java-classes": "./tns-java-classes"
    },
    output: {
        pathinfo: true,
        path: path.resolve("./app"),
        libraryTarget: "commonjs2",
        filename: "[name].js",
        jsonpFunction: "nativescriptJsonp"
    },
    resolve: {
        extensions: [
            ".ts",
            "",
            ".js",
        ],
        modules: [
            "node_modules/tns-core-modules",
            "node_modules"
        ]
    },
    resolveLoader: {
        root: path.join(__dirname, "..", "node_modules")
    },
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: "html"
            },
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    plugins: [
        FailPlugin,
        new webpack.optimize.CommonsChunkPlugin({
            name: ["tns-java-classes"]
        }),
        new CopyWebpackPlugin([
            {from: "**/*.css"}
        ]),
        new FixJsonpPlugin(),
    ]
};
