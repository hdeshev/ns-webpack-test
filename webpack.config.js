var bundler = require("nativescript-dev-webpack");
//var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
var path = require("path");
var failPlugin = require("webpack-fail-plugin");

var config = bundler.getConfig({
});

config.context = path.resolve("./app");
config.resolve.extensions.unshift(".ts");
config.entry.bundle = "./main.ts";

config.module = {
    loaders: [
        {
            test: /\.ts$/,
            loader: 'awesome-typescript-loader'
        }
    ]
};

config.plugins.push(failPlugin);

//config.plugins.push(new ForkCheckerPlugin());

//console.log(JSON.stringify(config, null, "    "));
module.exports = config;
