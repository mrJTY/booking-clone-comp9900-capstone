SHELL := bash
REPO_ROOT := `git rev-parse --show-toplevel`

# Init a git repo (it's not provided in a zip file so git commands fail)
git-init:
	git init

# Install the dependencies
install: git-init
	$(REPO_ROOT)/bin/install.sh

# Start the backend
backend:
	$(REPO_ROOT)/bin/start-api.sh

# Start the frontend
frontend:
	$(REPO_ROOT)/bin/start-frontend.sh

# Run tests on the backend
tests:
	$(REPO_ROOT)/bin/test-backend.sh


# Archive the repo
zip:
	git archive --format=zip --output=$(REPO_ROOT)/bst-final-software-quality.zip HEAD
