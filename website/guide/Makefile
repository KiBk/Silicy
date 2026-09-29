SLUG ?= sicily
IMAGE ?= registry.kibk.net/apps/$(SLUG):latest
DOMAIN ?= $(SLUG).apps.kibk.net
PLATFORM ?= linux/amd64
PORT ?= 8080
HEBE_ROOT ?= /Users/kibk/hebe
HEBE_PUBLISH ?= $(HEBE_ROOT)/bin/hebe-publish
HEBE_REGISTRY ?= $(HEBE_ROOT)/bin/hebe-registry

.PHONY: render check serve login build push push-crane publish verify release

render:
	python3 scripts/build_routes.py
	node scripts/render.mjs --source content.md --output public/index.html --copy-source public/source.md

check: render
	node --check scripts/render.mjs
	node --check public/app.js
	python3 scripts/check_site.py --root .

serve: check
	python3 -m http.server $(PORT) --directory public

login:
	$(HEBE_REGISTRY) login

build: check
	docker build --platform $(PLATFORM) -t $(IMAGE) .

push:
	docker push $(IMAGE)

push-crane: check
	IMAGE=$(IMAGE) PLATFORM=$(PLATFORM) ./scripts/build-and-push-crane.sh

publish:
	$(HEBE_PUBLISH) app $(SLUG) --image $(IMAGE) --port 80 --health-path /healthz --private

verify:
	python3 scripts/verify_live.py --root . --url https://$(DOMAIN)

release: push-crane publish verify
