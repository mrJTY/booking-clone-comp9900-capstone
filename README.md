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

_note: the above commands are not necessary on the CSE VLAB environment_

Once you have the prerequisites ready, install the application dependencies by running:
```shell
make install
```
**If it fails the first time, try `make install` again the second time.**

If issues persist with `make install`, navigate to the repo root and run the following command instead:

Install application dependencies:
```shell
./bin/install.sh
```

Verify that this installed the following:
- A Python environment at the `.venv` directory
- Node packages at `bookit-fe/node_modules`

## Starting the services

- Firstly, navigate to the repository root directory
- Then, open two separate terminals
- Enter the following commands

Start the backend service by running:
```shell
make backend
```

On a separate terminal, start the frontend by running:
```shell
make frontend
```
---
If there are any issues running the make commands, run the following commands instead:

Start the backend service by running:
```shell
./bin/start-api.sh
```

On a separate terminal, start the frontend by running:
```shell
./bin/start-frontend.sh
```

## Running test suite

To run the test suite, ensure the backend service is running.

To run the tests:
```shell
make install
```
