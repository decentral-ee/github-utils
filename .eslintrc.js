module.exports = {
    "extends": "eslint:recommended",
    "env": {
        "node": true,
        "es2017": true
    },
    "globals": {
        "web3": true
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": "off"
    }
};
