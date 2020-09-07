const HtmlWebPackPlugin       = require('html-webpack-plugin'); 
const MiniCssExtractPlugin    = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MinifyPlugin            = require('babel-minify-webpack-plugin');
const { CleanWebpackPlugin }  = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        js: './src/index.js',
        vanilla: './src/js/otroComponent.js'
    },
    output: {
        filename: 'main.[contentHash].js'
    },
    optimization: {
        minimizer: [ new OptimizeCssAssetsPlugin() ],
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'common',
                    chunks: 'all'
                }
            }
        }
    },
    module: {
        rules: [
            { 
                /*
                 Aqui se usa la traspilacion del js a versiones mas vieja de ECMAScript para ser
                 soportado en navegadores antiguos, se usa el loader de babel y se excluye la carpeta node_modules
                */
                test: /\.js$/, 
                exclude: /node_modules/, 
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.css$/,
                exclude: /styles\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {   
                test: /\.scss$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                    {loader: 'sass-loader'}
                ]
            },
            {
                test: /styles\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: { minimize: true }
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg|webp)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                            name: 'assets/[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(ttf|eot|woff2?|mp4|mp3|txt|xml|pdf)$/i,
                use: 'file-loader?name=assets/[name].[ext]'
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: './index.html',
            chunks: ['js']
        }),
        new HtmlWebPackPlugin({  
            template: './src/nosotros.html', 
            filename: './nosotros.html',
            chunks: ['vanilla']   
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contentHash].css',
            ignoreOrder: false
        }),
        new MinifyPlugin(), // ayuda a minimizar los .js con ayuda de babel minify, se complementan los dos - Pueden recibir dos paramentros (minifyOpts, pluginOpts)
        new CleanWebpackPlugin(), //permite eliminar la carpeta(antigua) /dist cada vez q se haga un build nuevo
    ]                             //tambien recibe parametros, pero los default hacen el trabajo de limpiar cuando cambia el codigo, tambien se puede pasar algo como esto  < new CleanWebpackPlugin(['dist/**/*.*']) >

}

