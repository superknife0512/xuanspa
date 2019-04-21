const path = require('path')
module.exports = {
    mode: 'development',
    entry: './public/javascripts/main.js',
    output: {
        filename: 'index.js',
        path: path.join(__dirname, 'public')
    },
    module:{
        rules:[
            {
                test: /\.(scss)$/,
                loader: ['style-loader', 'css-loader', 'sass-loader']
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
    }
}