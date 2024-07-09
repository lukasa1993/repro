import webpack from "webpack";
import HTMLWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isDev = process.env.NODE_ENV !== "production";

/** @type {import("webpack").Configuration} */
export default {
  mode: isDev ? "development" : "production",
  entry: isDev
    ? ["webpack-hot-middleware/client", "./app/index.ts"]
    : "./app/index.ts",
  output: {
    path: path.join(__dirname, "dist/client/assets"),
    filename: "index-[contenthash].js",
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: "app/template.html",
    }),
    new MiniCssExtractPlugin({
      filename: "style-[contenthash].css",
    }),
    isDev && new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            compilerOptions: {
              noEmit: false,
              outDir: "dist",
            },
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
    ],
  },
};
