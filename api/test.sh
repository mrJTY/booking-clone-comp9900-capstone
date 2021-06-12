#!/usr/bin/env bash

main() {
  virtualenv .venv
  ./.venv/bin/pip install -r requirements.txt
  API_URL="http://localhost:5000" ./.venv/bin/pytest -s .
}

main
