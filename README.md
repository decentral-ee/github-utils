# github-utils
Github Utilities for organizations.

# Setup

Create new `.env` file following `.env.example`.

# Examples

One liner to delete your stale github packages containing "-latest-" in versions:

```
node scripts/list-packages.js contracts -o DESC | jq '[.[] | select(.version | contains("-latest-"))] | .[10:] | map(.id) | .[]' -r | xargs node scripts/delete-packages.js
```
