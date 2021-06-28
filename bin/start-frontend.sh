#!/usr/bin/env bash

set -eu

repo_root=$(git rev-parse --show-toplevel)
export REPO_ROOT="${repo_root}"

main() {
  cd "${REPO_ROOT}"/bookit-fe
  yarn install
  yarn start
}

main
