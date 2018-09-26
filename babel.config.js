module.exports = {
    "plugins": ['@babel/plugin-proposal-class-properties'],
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "node": "8.11.1"
                }
            }
        ]
    ],
    "ignore": [
        "node_modules",
        "doc",
        "man",
        "babel.config.js",
        "coverage"
    ]
};
