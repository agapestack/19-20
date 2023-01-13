GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
CYAN   := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

all: help

## install
install: install-env install-app ## install everything
	
install-env: ## install go & node, generate default env
	cp back/.env.example back/.env

install-app: ## install back and front dependencies
	cd front; npm i; cd ..

## run
run-back: ## run server
	cd back; go run cmd/*.go

run-front: ## run react client
	cd front; npm run start

.PHONY: todos
todos: ## show todos
	@echo -------TODOS-------
	@cat README.md | grep -i '^\[[x ]\]'

## Help:
help: ## Show this help.
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} { \
		if (/^[a-zA-Z_-]+:.*?##.*$$/) {printf "    ${YELLOW}%-20s${GREEN}%s${RESET}\n", $$1, $$2} \
		else if (/^## .*$$/) {printf "  ${CYAN}%s${RESET}\n", substr($$1,4)} \
		}' $(MAKEFILE_LIST)