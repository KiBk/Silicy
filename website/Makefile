PORT ?= 8080
IMAGE ?= sicily-trip:local

.PHONY: serve check build run

serve:
	python3 -m http.server $(PORT)

check:
	node --check app.js
	node --check route-data.js
	node --check dotwatcher-config.js
	@test -s index.html
	@test -s styles.css
	@test -s modica-catania-fausto.gpx

build:
	docker build -t $(IMAGE) .

run:
	docker run --rm -p $(PORT):80 $(IMAGE)
