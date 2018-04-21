/* jshint node: true */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: path.resolve(__dirname, "src", "index.js"),
    mode: "development",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "build")
    },
    devServer: {
        contentBase: path.resolve(__dirname, "build")
    },
    module: {
        rules: [{
            test: /\.glsl$/,
            use: [{loader: 'file-loader', options: {}}]
        }]
    },
    plugins: [new HtmlWebpackPlugin({template: path.resolve(__dirname, "src", "template.html")})]
};