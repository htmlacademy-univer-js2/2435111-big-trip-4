const path = require('path'); // Импортируем модуль "path" для работы с путями файлов
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.js', // Точка входа для сборки проекта
    
    output: {
        filename: 'bundle.[contenthash].js', // Имя выходного файла сборки
        path: path.resolve(__dirname, 'build'), // Путь для выходного файла сборки
        clean: true,
    },

    devtool: 'source-map',

    plugins: [
        new HtmlWebpackPlugin({
          template: './public/index.html',
        }),
        new CopyPlugin({
            patterns: [
              {
                from: 'public',
                globOptions: {
                  ignore: ['**/index.html'],
                },
              },
            ],
        }),
    ],
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              },
            },
          },
        ]
    }
};