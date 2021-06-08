#!/usr/bin/env bash

set -eu
set -o pipefail

repo_root=$(git rev-parse --show-toplevel)
export REPO_ROOT="${repo_root}"
export PYENV_VERSION="3.7.9"
export API_ROOT="${REPO_ROOT}"/api
export PIPENV_PIPFILE="${API_ROOT}"/Pipfile

pipenv run flask db init
pipenv run flask db migrate -m "users table"
pipenv run flask db upgrade