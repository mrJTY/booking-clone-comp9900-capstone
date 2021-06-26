#!/usr/bin/env bash

set -eu

repo_root=$(git rev-parse --show-toplevel)
export REPO_ROOT="${repo_root}"
export FLASK_APP="${REPO_ROOT}"/api/__init__.py
export PYTHONPATH="${REPO_ROOT}":"${REPO_ROOT}"/api

main() {
  # Clean this up on boot
  rm -rf api/migrations
  rm -rf api/*.db

  # Go to the api directory
  cd "${REPO_ROOT}"/api

  # Start the api
  "${REPO_ROOT}"/.venv/bin/python "${REPO_ROOT}"/api/run.py
}

main
