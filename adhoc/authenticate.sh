#!/usr/bin/env bash
# Test the auth endpoint

main(){
  # https://pythonhosted.org/Flask-JWT/
  # This should return an access token
  local access_token
  access_token=$(
    curl -s -X POST \
      -H "Content-Type: application/json" \
      -d '{"username": "john", "password": "keanu"}' \
      http://localhost:5000/auth |
    jq -r '.access_token'
  )
  echo "Authorization: JWT ${access_token}"
  # Test to see if you can access the protected page
  curl -s -X GET \
    -H "Authorization: JWT ${access_token}" \
    http://localhost:5000/protected


}

main
