const path = require('path');

const config = {
    entry: {
        'main': './main.js',
    },
    module: {
        rules: [
            {
                test: /\.js/,
                use: ['babel-loader'],
            },
        ]
    },
};

module.exports = config;

