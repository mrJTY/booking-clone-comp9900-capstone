# Getting Started with Create React App
This is a reference example react app.

Reference: https://amplify-analytics.workshop.aws/01-getting-started.html

## Install dependencies

```shell
$ cd bookit
$ npm install
```

## Configure Amplify

```shell
$ cd bookit
$ amplify pull --appId dw8w9gnfvrrdu --envName dev

? Select the authentication method you want to use: AWS access keys

 (Contact account admin for creds)
? accessKeyId:  ********************
? secretAccessKey:  ****************************************
? region:  us-east-2

Amplify AppID found: d2za2chtlf8675. Amplify App name is: reactamplified
Backend environment dev found in Amplify Console app: reactamplified
? Choose your default editor: None
? Choose the type of app that you're building javascript
Please tell us about your project
? What javascript framework are you using react
? Source Directory Path:  src
? Distribution Directory Path: build
? Build Command:  npm run-script build
? Start Command: npm run-script start
? Do you plan on modifying this backend? Yes
```

## Start the frontend server

```
npm start
```

Demo: https://dev.d2za2chtlf8675.amplifyapp.com/

## Start the backend API and databases

```shell
amplify mock
```

## Updating the API

If you need to change the data model:
- edit `amplify/backend/api/schema.graphql`
- codegen the queries/mutations/subscriptions.js using:

```shell
amplify codegen configure
```
Follow the prompts, use the defaults. This will generate JS code for us under `src/graphql` so that we can interact with the changes on the data model.

## Installing from scratch
This is how the project was created from scratch:
* https://docs.amplify.aws/start/getting-started/setup/q/integration/react#create-a-new-react-app

```shell
npx create-react-app react-amplified
```

```shell
npm install aws-amplify @aws-amplify/ui-react @material-ui/core @material-ui/icons
```



https://docs.amplify.aws/start/getting-started/installation/q/integration/react#option-1-watch-the-video-guide

```shell
# This only needs to be done once
amplify init

# New config files will be written in ./amplify directory
# DO NOT EDIT those directly
```

# Add an API

```shell
amplify add api
# follow prompts with defaults
```

# Add Auth

```shell
amplify add auth
```

# Add hosting

```shell
amplify add hosting
```

That's it! We'll get a hosted URL for our app.

# Local dev

Always use local whenever possible. For example, if you would like to test how your front-end interacts with the API, setup a local instance by:

```shell
amplify mock
```

# Deploying

CI/CD will deploy changes automatically to dev/prod environments.