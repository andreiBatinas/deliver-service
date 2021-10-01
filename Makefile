# -- SH Adjustments
null      :=
SPACE     := $(null) $(null)

# -- Code
PROJECT_PATH = $(subst $(notdir $(SPACE)),/,$(CURDIR))
# Get dir        $(notdir $(subst $(SPACE),,$(CURDIR)))
# Get parent dir $(subst $(notdir $(CURDIR)),,$(CURDIR))
BIN = $(PROJECT_PATH)node_modules/.bin
FILES = $(wildcard *.ts)

#-- Management
DATE    ?= $(shell date +%FT%T%z)
VERSION ?= $(shell git describe --tags --always --dirty --match=v* 2> /dev/null || \
			cat $(CURDIR)/.version 2> /dev/null || echo v0)

# -- View utils
V = 0
Q = $(if $(filter 1,$V),,@)
M = $(shell printf "\033[34;1m➡\033[0m")

# -- No params call
.PHONY: all
all: help

# -- Setup
.PHONY: install
install: ; $(info $(M) Installing dependencies.)	@ ## Install project dependencies
	$Q npm i

.PHONY: install-cache
install-cache: ; $(info $(M) Installing cache dependencies.)	@ ## Install cache project dependencies. package-lock.jon must exist
	$Q npm ci

# -- Testing
.PHONY: test-unit
test-unit: ; $(info $(M) Running unit tests ...)	@ ## Run unit tests
	$Q npm run test:unit

.PHONY: test-e2e
test-e2e: ; $(info $(M) Running e2e tests ...)	@ ## Run e2e tests
	$Q echo "e2e command not implemented"

.PHONY: test-coverage
test-coverage: ; $(info $(M) Running coverage check ...)	@ ## Run a coverage check
	$Q npm run test:coverage

# -- Running
.PHONY: run
run: ; $(info $(M) Running localhost ...)	@ ## Run locally
	$Q npm start

# -- Running debug
.PHONY: run-debug
run-debug: ; $(info $(M) Running localhost ...)	@ ## Run locally
	$Q DEBUG=* npm start

# -- Building
.PHONY: proto-gen
proto-gen: ; $(info $(M) Generating proto repository ...) @ ## Generate protobuf sources
	$Q ./node_modules/.bin/grpc_tools_node_protoc --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts --ts_out=./proto -I ./proto proto/*.proto
	$Q ./node_modules/.bin/grpc_tools_node_protoc --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts --js_out=import_style=commonjs,binary:./proto --grpc_out=./proto -I ./proto proto/*.proto

.PHONY: build
build: ; $(info $(M) Building docker image ...)	@ ## Build docker image

.PHONY: clean
clean: ; $(info $(M) Cleanup project ...)	@ ## Cleanup project

.PHONY: release
release: ; $(info $(M) Creating release ...)	@ ## Create release and change notes
	$Q npx semantic-release

# -- Misc
.PHONY: sys-check
sys-check: ; $(info $(M) Node Version checking...)	@ ## Check node version
	$Q echo "Node version: $(shell node --version)"
	$Q echo " NPM version: $(shell npm --version)"
	$Q echo " TSC version: $(shell $(BIN)/tsc --version)"

.PHONY: version
version: ; $(info $(M) Version: $(VERSION))	@ ## Current version

help:
	@grep -E '^[ a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
