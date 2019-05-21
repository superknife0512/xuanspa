const path = require('path');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = {
    // mode: 'development',
    entry:{
        main: './public/javascripts/main.js',
        vendor: './public/javascripts/vendor.js'
    } ,
    output: {
        filename: "[name].bundle.js",
        path: path.join(__dirname, 'public')
    },
    optimization:{
        minimizer:[
            new OptimizeCssAssetsPlugin(),
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
                cache: true,
                parallel: true,
                sourceMap: true, // Must be set to true if using source-maps in production
              }),
            
        ]
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