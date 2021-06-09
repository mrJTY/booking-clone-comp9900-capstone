#!/usr/bin/env bash

main(){

  # Have to wait until api is ready...
  # Sleep for temporary hack, do a retry instead
  echo "Waiting for API to be ready..."
  sleep 10

  # Register some dummy users
  curl -X POST \
    -H "Content-Type: application/json" \
    -d '{"username": "john", "email": "john@wick.com"}' \
    http://localhost:5000/register_user

  curl -X POST \
    -H "Content-Type: application/json" \
    -d '{"username": "alon", "email": "alon@mask.com"}' \
    http://localhost:5000/register_user
}

main
