#!/usr/bin/env bash

set -eu

repo_root=$(git rev-parse --show-toplevel)
export REPO_ROOT="${repo_root}"

install_backend() {
  # Install the backend
  # sudo apt install python3 python3-pip
  pip3 install virtualenv
  python3 -m virtualenv "${REPO_ROOT}"/.venv
  "${REPO_ROOT}"/.venv/bin/pip install -r "${REPO_ROOT}"/api/requirements.txt
}

main() {
  install_backend
}

main
