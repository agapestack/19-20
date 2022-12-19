GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
CYAN   := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

all: help

## run
run-back: ## run server
	cd back; air; cd .. 

run-front: ## run react client
	cd front; npm run start

## docker
docker-list: ## list running container
	sudo docker container ls

docker-restart: docker-stop docker-run ## restart docker-compose
	
docker-run: ## launch docker-compose
	sudo docker-compose -f "back/docker-compose.yml" up -d --build

docker-stop: ## stop docker-compose
	sudo docker-compose -f "back/docker-compose.yml" down



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