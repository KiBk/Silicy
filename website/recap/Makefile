PORT ?= 8788
URL ?= https://kibk.net/sicily

.PHONY: render rebuild-private check check-private serve verify

render:
	node scripts/render_recap.mjs

rebuild-private:
	python3 scripts/build_data.py
	node scripts/render_recap.mjs

check: render
	node --check scripts/render_recap.mjs
	node --check public/app.js
	node --check public/map-gestures.js
	node scripts/check_gestures.mjs
	python3 scripts/check_site.py --root .
	python3 scripts/check_public.py

check-private: rebuild-private check
	python3 scripts/check_privacy.py

serve: check
	python3 -m http.server $(PORT) --bind 127.0.0.1 --directory public

verify:
	python3 scripts/verify_pages.py --url $(URL)
