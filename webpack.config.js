const path = require('path');
const env = process.env.NODE_ENV || 'production';
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

//used to minimize .js
const minimizer = new TerserPlugin({
    cache: false,
    parallel: true,
    sourceMap: true,
    terserOptions: {
      // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
    }
})

WebpackConfig = {
    // will generate dist/tour.js from src/js/main.js
    entry: {
        tour: ['./src/css/main.scss','./src/js/main.js'],
    },
    // will minimize when mode = development
    mode: env,
    // output options
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: "komodo-tour",
        libraryTarget: "umd"
    },
    // handle loader for each file type
    module: {
        rules: [
        // .css
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
        // .scss
        {
            test: /\.scss$/,
            use: [
                {
                    // this loader print css on its own file
                    loader: MiniCssExtractPlugin.loader,
                },
                'css-loader', 'sass-loader']
        },
        // load font
        {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            }]
        },
        // load img
        {
            test: /\.(png|jpg|jpeg)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'images/'
                }
            }]
        },
        // load json.gz as normal json
        {
            test: /\.json.gz$/,
            enforce: 'pre',
            use: ['json-loader', 'gzip-loader']
        },
        // the following is need to createjs to work ( dont ask me why)
        {
            test: /node_modules[/\\]createjs/,
            loaders: [
              'imports-loader?this=>window',
              'exports-loader?window.createjs'
            ]
          },
        ]
    },
    plugins: [
        //this plugin is use for printing css on indepednant file
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
    ],
    resolve: {
        alias: {
          // needed to import createjs
          createjs: 'createjs/builds/1.0.0/createjs.js',
          // shortcut aliases
          '@root': path.resolve('./'),
          '@src': path.resolve('./src/'),
          '@css': path.resolve('./src/css/'),
          '@js': path.resolve('./src/js/'),
          '@asset': path.resolve('./src/assets/'),
        }
    },
    // use source-map for dev
    devtool: env == 'development' ? 'cheap-eval-source-map' : false,
    // define optimization (production env only)
    optimization: {
        minimizer: env == 'production' ? [minimizer] : [],
    },
};

if(env == 'production') {
    WebpackConfig.plugins.push(new CompressionPlugin());
    WebpackConfig.plugins.push(new CopyWebpackPlugin([{from: './src/assets/img', to: 'images/' }]));
}

module.exports = WebpackConfig;