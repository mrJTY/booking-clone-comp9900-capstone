#!/usr/bin/env bash

set -eu

repo_root=$(git rev-parse --show-toplevel)
export REPO_ROOT="${repo_root}"
export FLASK_APP="${REPO_ROOT}"/api/__init__.py
export PYTHONPATH="${REPO_ROOT}"/api

main() {
  # Clean this up on boot
  rm -rf api/migrations
  rm -rf api/*.db

  # Go to the api directory
  cd "${REPO_ROOT}"/api

  # Init the db
  "${REPO_ROOT}"/.venv/bin/flask db init
  "${REPO_ROOT}"/.venv/bin/flask db migrate -m "users table"
  "${REPO_ROOT}"/.venv/bin/flask db upgrade

  # Start the api
  "${REPO_ROOT}"/.venv/bin/flask run --host=0.0.0.0
}

main
