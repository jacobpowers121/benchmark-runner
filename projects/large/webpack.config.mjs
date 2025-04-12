import path from "node:path";

export default {
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.js",
        path: path.resolve(".", "dist")
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: "babel-loader",
                exclude: /node_modules/
            }
        ]
    },
    devtool: "source-map"
};
