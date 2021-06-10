#!/usr/bin/env bash

export FLASK_APP=__init__.py

main() {
  # Temporary hack to wait until postgres is ready
  echo "Waiting for database to be ready..."
  sleep 5

  # Clean this up
  rm -rf migrations

  # Init the db
  flask db init
  flask db migrate -m "users table"
  flask db upgrade

  # Start the api
  flask run --host=0.0.0.0
}

main
