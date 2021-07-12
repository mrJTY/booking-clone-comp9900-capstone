#!/usr/bin/env bash
# Test the auth endpoint

set -eu

main(){
  # Register some dummy users
  curl -X POST \
    -H "Content-Type: application/json" \
    -d '{"username": "test_auth_adhoc", "email": "test@adhoc.com", "password": "test"}' \
    http://localhost:5000/users

  # Test good auth
  curl -X POST \
    -H "Content-Type: application/json" \
    -d '{"username": "test_auth_adhoc", "password": "test"}' \
    http://localhost:5000/auth/login

  # Test bad auth
  curl -X POST \
    -H "Content-Type: application/json" \
    -d '{"username": "test_auth_adhoc", "password": "bad-password"}' \
    http://localhost:5000/auth/login

}

main
