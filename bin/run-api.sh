#!/usr/bin/env bash

set -eu
set -o pipefail

repo_root=$(git rev-parse --show-toplevel)
export REPO_ROOT="${repo_root}"
export PYENV_VERSION="3.7.9"
export API_ROOT="${REPO_ROOT}"/api
export PIPENV_PIPFILE="${API_ROOT}"/Pipfile
export FLASK_APP="${API_ROOT}"/api.py

main() {
  pipenv run flask run
}

main