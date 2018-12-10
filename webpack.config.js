const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    entry: './index.js',
    output: {
        filename: `image-viewer.min.js`,
        path: path.resolve(__dirname, 'dist'),
        library: 'imageViewer',
        libraryTarget: "umd"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    plugins: [
        new CleanWebpackPlugin(['dist'])
    ]
}