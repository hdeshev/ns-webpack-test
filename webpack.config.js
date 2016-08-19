var webpack = require("webpack");
//var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
var path = require("path");
var failPlugin = require("webpack-fail-plugin");

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
            ".android.js"
        ],
        modulesDirectories: [
            "node_modules/tns-core-modules",
            "node_modules"
        ]
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    plugins: [
        failPlugin,
        new webpack.optimize.CommonsChunkPlugin({
            name: ["tns-java-classes"]
        }),
    ]
};
