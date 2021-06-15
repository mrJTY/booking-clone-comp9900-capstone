# Blue Sky Thinking

# Quick start

Install by:
```shell
./bin/install.sh
```

Start the backend and frontend services by:
```shell
./bin/start-api.sh
```

# Backend API

Flask + SQLITE DB

## Create a user
```shell
 curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "email": "john@wick.com", "password": "keanu"}' \
  http://localhost:5000/users
```

## Authenticate a user

Authenticating the user will give a token

```shell
# Login as the user, receive the access token
local access_token
access_token=$(
    curl -s -X POST \
      -H "Content-Type: application/json" \
      -d '{"username": "john", "password": "keanu"}' \
      http://localhost:5000/auth |
    jq -r '.access_token'
)
  
# Protected endpoint can only be accessed by logged in users
curl -s -X GET \
    -H "Authorization: JWT ${access_token}" \
    http://localhost:5000/current_user
```

# Front end
TODO(Vidan)

# Reference
- Auth: https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-iv-database
