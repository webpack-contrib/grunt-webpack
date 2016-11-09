const path = require('path');

const config = {
    entry: {
        'main': './main.ts',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['awesome-typescript-loader'],
            },
        ]
    },
};

module.exports = config;

