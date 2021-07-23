# Blue Sky Thinking
COMP9900 Project (BookIt)

# Quick start

## Prerequisites
Ensure you have the prerequisites installed such as:
- `python3`
- `pip3`
- `nodejs`
- `yarn`

On an Ubuntu / Debian based system, these packages can be installed by:

```shell
sudo apt install python3 python3-pip npm
sudo npm install --global yarn
```

Once you have the prerequisites ready, install the application dependencies by running:
```shell
make install
```

Verify that this installed the following:
- A Python environment at the `.venv` directory
- Node packages at `bookit-fe/node_modules`

## Starting the services

Start the backend service by running:
```shell
make backend
```

On a separate terminal, start the frontend by running:
```shell
make frontend
```
