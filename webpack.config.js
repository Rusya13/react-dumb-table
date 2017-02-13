const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src',
    output: { path: __dirname + 'lib', filename: 'bundle.js' },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react'],
                    //plugins: ['transform-decorators-legacy' ]
                }
            }
        ]
    },
    devServer: {
        inline: true,
        host: "0.0.0.0",
        port: 3333,
        contentBase: "lib/",
        historyApiFallback: {
            index: '/index-static.html'
        }
    },
};