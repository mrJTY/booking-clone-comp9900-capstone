#!/usr/bin/env bash

set -eu

repo_root=$(git rev-parse --show-toplevel)
export REPO_ROOT="${repo_root}"

main() {
  "${REPO_ROOT}"/.venv/bin/black .
  if [ -z "$(git status --porcelain)" ]; then
    echo "Code is clean!"
    exit 0
  else
    echo "Please clean up your Python code."
    git --no-pager diff
    exit 1
  fi
}

main
