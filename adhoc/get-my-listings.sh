#!/usr/bin/env bash

set -eu

main(){
  curl -X GET \
    -H "Authorization: Password password" \
    -H "Username: stephanie" \
    http://localhost:5000/listings/mylistings
}

main
