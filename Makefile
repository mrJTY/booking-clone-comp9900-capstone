REPO_ROOT := `git rev-parse --show-toplevel`

# Install the dependencies
install:
	$(REPO_ROOT)/bin/install.sh

# Start the backend
backend:
	$(REPO_ROOT)/bin/start-backend.sh

# Start the frontend
frontend:
	$(REPO_ROOT)/bin/start-frontend.sh

