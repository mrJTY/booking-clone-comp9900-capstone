#!/usr/bin/env bash

main() {
  # Init the db
  flask db init
  flask db migrate -m "users table"
  flask db upgrade

  # Populate data
  python populate_users.py

  # Start the api
  flask run
}

main
