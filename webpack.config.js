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
            }
        ]
    }
}