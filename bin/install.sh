#!/usr/bin/env bash

set -eu

repo_root=$(git rev-parse --show-toplevel)
export REPO_ROOT="${repo_root}"

install_backend() {
  # Install the backend
  pip install virtualenv
  virtualenv "${REPO_ROOT}"/.venv
  "${REPO_ROOT}"/.venv/bin/pip install -r "${REPO_ROOT}"/api/requirements.txt
}

main() {
  install_backend
}

main
