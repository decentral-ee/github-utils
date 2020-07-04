const axios = require("axios");

// program
const program = require("commander");
program.version(require("./package.json").version);

// graphql
async function graphql(query, { accept } = {}) {
    return await axios.post("https://api.github.com/graphql", {
        query
    }, {
        headers: {
            "Authorization": `bearer ${process.env.GITHUB_TOKEN}`,
            "Accept": accept ? accept : "application/vnd.github.v3+json",
        }
    });
}

module.exports = {
    program,
    graphql,
};
