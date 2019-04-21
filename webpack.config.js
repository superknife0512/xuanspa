const path = require('path');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    mode: 'development',
    entry:{
        main: './public/javascripts/main.js',
        vendor: './public/javascripts/vendor.js'
    } ,
    output: {
        filename: "[name].bundle.js",
        path: path.join(__dirname, 'public')
    },
    module:{
        rules:[
            {
                test: /\.(scss)$/,
                loader: [
                        miniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader'
                    ]
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options:{
                            publicPath: 'public'
                        }
                    }
                ]
            },
        ]
    },
    plugins: [new miniCssExtractPlugin({
        filename: "stylesheets/[name].bundle.css"
    }), ]
}