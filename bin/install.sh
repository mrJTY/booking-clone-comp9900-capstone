#!/usr/bin/env bash

set -eu

repo_root=$(git rev-parse --show-toplevel)
export REPO_ROOT="${repo_root}"

check_prerequisites() {
  echo "If these fail, run:"
  echo "sudo apt install python3 python3-pip npm"
  echo "sudo npm install --global yarn"
  echo ""
  echo "Checking if you have python..."
  hash python3
  echo "OK"
  echo "Checking if you have pip3..."
  hash pip3
  echo "OK"
  echo "Checking if you have npm..."
  hash npm
  echo "OK"
}

install_backend() {
  echo "Installing the backend..."
  pip3 install virtualenv
  rm -rf "${REPO_ROOT}"/.venv
  python3 -m virtualenv "${REPO_ROOT}"/.venv
  "${REPO_ROOT}"/.venv/bin/pip install -r "${REPO_ROOT}"/api/requirements.txt
}

install_frontend() {
  echo "Installing the frontend..."
  cd "${REPO_ROOT}"/bookit-fe
  yarn install
  cd -
}

main() {
  check_prerequisites
  install_backend
  install_frontend
  echo "Done! You're all set to go!"
}

main
