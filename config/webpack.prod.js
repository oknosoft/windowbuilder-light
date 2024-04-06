const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: process.env.NODE_ENV || "production",  // production
  entry: "./src/index.js",                      // входная точка - исходный файл
  output:{
    path: path.resolve(__dirname, "../build"),  // путь к каталогу выходных файлов - папка public
    publicPath: "./",
    filename: "bundle.js"                       // название создаваемого файла
  },
  devtool: false,
  plugins: [],
  resolve: {
    fallback: {
      crypto: false,
      levelup: false,
      util: false,
      assert: false,
      stream: false,
      "pouchdb-adapter-memory": false,
    }
  },
  module:{
    rules:[                                   //загрузчик для jsx
      {
        test: /\.jsx?$/,                      // определяем тип файлов
        exclude: /(node_modules)/,            // исключаем из обработки папку node_modules
        loader: 'babel-loader',               // определяем загрузчик
        options:{
          presets: ['@babel/preset-react']    // используемые плагины
        }
      },
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ]
  }
}
