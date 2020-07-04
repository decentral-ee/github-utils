const { program, graphql } = require("../common");
require("dotenv").config();

(async () => {
    program
        .description("List packages")
        .option("-o, --order-by <orderBy>", "listing order", "DESC")
        .arguments("<packageName>");
    program.parse(process.argv);
    const packageName = program.args[0];
    if (program.orderBy in ["DESC", "ASC"]) {
        console.error("unknown order type", program.orderBy);
        program.exit(1);
    }
    if (typeof packageName === "undefined") {
        console.error("no packageName is provided");
        process.exit(1);
    }

    const createQuery = (cursor) => `query {
        organization(login: "${process.env.GITHUB_ORG_NAME}") {
            packages (
                first: 1,
                names: ["${packageName}"]
            ) {
                nodes {
                    versions (
                        ${ cursor ? `after: "${cursor}",` : "" }
                        first: 100,
                        orderBy: { direction: ${program.orderBy} }
                    ) {
                        nodes {
                            id
                            version
                        }
                        edges {
                            cursor
                        }
                    }
                }
            }
        }
    }`;

    const result = [];

    let cursor = "";
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const res = await graphql(createQuery(cursor));
        if (res.status !== 200 || res.data.errors) {
            console.error(res.data);
            process.exit(2);
        }
        const packages = res.data.data.organization.packages;
        if (packages.nodes.length !== 1) {
            console.error(`Package ${packageName} not found from the org`);
            process.exit(3);
        }
        const versions = packages.nodes[0].versions;
        if (versions.nodes.length > 0) {
            result.push(...versions.nodes);
            cursor = versions.edges[versions.edges.length - 1].cursor;
        } else break;
    }

    console.log(JSON.stringify(result, null, 2));
})();
