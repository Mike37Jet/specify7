const webpack = require("webpack");
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.(png)|(gif)|(jpg)$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 100000
                    }
                }]
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.html$/,
                use: [{
                    loader: "underscore-template-loader",
                    options: {
                        engine: 'underscore',
                    }
                }]
            },
            {
                test: /\.[tj]sx?$/,
                exclude: /(node_modules)|(bower_components)/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ['@babel/preset-react'],
                            [
                                '@babel/preset-env',
                                {
                                    targets: "defaults"
                                }
                            ]
                        ]
                    }
                }]
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    plugins: [
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
        new WebpackManifestPlugin()
    ],
    devtool: 'source-map',
    entry: {
        main: "./lib/main.js",
        login: "./lib/login.js",
        passwordchange: "./lib/passwordchange.js",
        choosecollection: "./lib/choosecollection.js",
    },
    output: {
        path: __dirname + "/../static/js/",
        publicPath: "/static/js/",
        filename: "[name].[contenthash].bundle.js"
    },
};
