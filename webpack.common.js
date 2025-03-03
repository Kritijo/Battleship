const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        main: "./src/index.js",
        game: "./src/game.js",
        info: "./src/info.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/pages/home.html",
            filename: "index.html",
            chunks: ["runtime", "vendors", "main"],
        }),
        new HtmlWebpackPlugin({
            template: "./src/pages/game.html",
            filename: "game.html",
            chunks: ["runtime", "vendors", "game"],
        }),
        new HtmlWebpackPlugin({
            template: "./src/pages/info.html",
            filename: "info.html",
            chunks: ["runtime", "vendors", "info"],
        }),
    ],
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ogg|mp3|wav)$/i,
                type: "asset/resource",
            },
        ],
    },
};
