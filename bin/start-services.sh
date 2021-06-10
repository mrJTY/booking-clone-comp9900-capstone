#!/usr/bin/env bash

set -eu
set -o pipefail

repo_root=$(git rev-parse --show-toplevel)
export REPO_ROOT="${repo_root}"

main() {
  docker-compose down
  docker-compose up --build --force-recreate --remove-orphans
}

main
