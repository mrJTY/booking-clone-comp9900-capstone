# Amplify Notes
AWS Amplify helps front-end web and mobile developers build apps faster. It consists of a development framework and a web hosting service to build and deploy secure and scalable mobile and web applications powered by AWS.

https://aws.amazon.com/amplify/resources/

## Getting started
https://sandbox.amplifyapp.com/getting-started

## Install Amplify

```sh
curl -sL https://aws-amplify.github.io/amplify-cli/install | bash && $SHELL
```

## Install NPM and React-Scripts

```sh

npm install -g react-scripts
```

## React starter project
https://docs.amplify.aws/start/getting-started/setup/q/integration/react

See `examples/react-amplified`

## Managing multiple environments

It's best practice to keep separate environments:
* `dev` as a sandbox to play around with things
* `prod` as a stable release channel.

See: https://docs.amplify.aws/cli/teams/sandbox

## CI/CD Deployment

We have CI/CD integration with our Github repository. It is using Github actions, see:

https://docs.github.com/en/actions/learn-github-actions/introduction-to-github-actions

Everytime there is a merge to master, it will deploy changes to our `dev` environment.

TODO(justin): Setup deployment to `prod` environments on `release` creation
https://docs.github.com/en/actions/reference/events-that-trigger-workflows#release
