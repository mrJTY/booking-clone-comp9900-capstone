#!/usr/bin/env bash

set -eu
set -o pipefail

repo_root=$(git rev-parse --show-toplevel)
export REPO_ROOT="${repo_root}"
export PYENV_VERSION="3.7.9"
export API_ROOT="${REPO_ROOT}"/api
export PIPENV_PIPFILE="${API_ROOT}"/Pipfile

main() {

  cd "${API_ROOT}"
  pyenv install -s "${PYENV_VERSION}"

  python --version
  which pipenv
  pip install pipenv
  # you only need to lock when packages change
  # pipenv lock
  pipenv install --deploy
}

main