#!/usr/bin/env bash

set -eu

repo_root=$(git rev-parse --show-toplevel)
export REPO_ROOT="${repo_root}"

main() {
  API_URL="http://localhost:5000" \
    "${REPO_ROOT}"/.venv/bin/pytest -s \
    "${REPO_ROOT}"/api
}

main
