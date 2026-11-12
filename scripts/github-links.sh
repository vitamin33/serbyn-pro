#!/bin/bash
# Point the GitHub profile and the public repos at serbyn.io, so every repo
# visitor has a way to the site and the site gets its first followed links.
# Changes public GitHub metadata. Run it yourself: bash scripts/github-links.sh
set -euo pipefail
SITE=https://serbyn.io
ME=vitamin33

echo "proof-of-green"
gh repo edit "$ME/proof-of-green" \
  --homepage "$SITE/blog/proof-of-green-checks-every-done" \
  --add-topic claude-code --add-topic codex --add-topic ai-agents \
  --add-topic agent-reliability --add-topic hooks

echo "agent-eval-labs"
gh repo edit "$ME/agent-eval-labs" \
  --homepage "$SITE/blog/same-model-0-and-100-where-the-verifier-gap-actually-lives"

echo "ascend-core"
gh repo edit "$ME/ascend-core" \
  --homepage "$SITE/work/ascend-autonomous-agents" \
  --add-topic ai-agents --add-topic agent-orchestration

# Last, because it needs the extra "user" scope on the gh token. The repo
# edits above work without it.
echo "profile website -> $SITE"
if gh api user -X PATCH -f blog="$SITE" --jq .blog 2>/dev/null; then
  echo "done"
else
  echo "Repos are updated. The profile website was NOT changed:"
  echo "the gh token has no \"user\" scope. Run this, then run the script again:"
  echo "  gh auth refresh -h github.com -s user"
  exit 1
fi
