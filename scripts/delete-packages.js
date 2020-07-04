const { program, graphql } = require("../common");
require("dotenv").config();

(async () => {
    program
        .description("Delete packages")
        .arguments("<packageVersionId1> [packageVersionId1] [...]");
    program.parse(process.argv);
    if (program.args.length === 0) {
        console.error("At least one package version id is required");
        process.exit(1);
    }
    for (let i = 0; i < program.args.length; ++i) {
        const packageVersionId = program.args[i];
        let res = await graphql(`query {
             node(id: "${packageVersionId}") {
                ... on PackageVersion {
                    version
                    package {
                        repository {
                            owner {
                                login
                            }
                        }
                        name
                    }
                }
            }
        }`);
        if (res.status !== 200 || res.data.errors) {
            console.error(res.data.errors);
            process.exit(2);
        }
        const node = res.data.data.node;
        console.log(`Deleting package @${node.package.repository.owner.login}/${node.package.name}@${node.version}...`);
        res = await graphql(`mutation {
            deletePackageVersion(
                input: {
                    packageVersionId: "${packageVersionId}"
                }
            )
            { success }           
        }`, {
            // https://docs.github.com/en/graphql/overview/schema-previews#access-to-package-version-deletion-preview
            accept: "application/vnd.github.package-deletes-preview+json"
        });
        console.log(res.data, "!!");
        if (res.status !== 200 || res.data.errors || !res.data.data.deletePackageVersion.success) {
            console.error("Deletion failed: ", res.data.errors);
        } else {
            console.log("Deletion was successful.");
        }
    }
})();
