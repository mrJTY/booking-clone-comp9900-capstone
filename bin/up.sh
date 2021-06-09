#!/usr/bin/env bash

set -eu
set -o pipefail

repo_root=$(git rev-parse --show-toplevel)
export REPO_ROOT="${repo_root}"

main() {
  docker-compose up
  # Add these flags if images are stale --force-recreate --build
}

main
