import path from 'path';
import { fileURLToPath } from 'url';
import CopyPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      background: './src/background/background.ts',
      ['text-launcher']: './src/content/text-launcher.ts',
      option: './src/option/option.ts',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader, // style-loaderをMiniCssExtractPlugin.loaderに置き換え
            'css-loader',
            'postcss-loader',
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.css'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: 'public',
            to: path.resolve(__dirname, 'dist'),
            globOptions: {
              ignore: ['**/*.DS_Store'],
            },
          },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
    ],
    devtool: isProduction ? false : 'source-map',
    mode: isProduction ? 'production' : 'development',
    watchOptions: {
      ignored: /node_modules/,
    },
  };
};
