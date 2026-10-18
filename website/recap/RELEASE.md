# GitHub Pages release

Target: **https://kibk.net/sicily/**, from the existing public **KiBk/sicily** repository.

Published and verified **17 October 2026**. GitHub Pages uses HTTPS and the workflow publishing method.

- Release commit: `ea63f3c35d5b9f6d3ac4172415323ccf415d91fe`.
- [Successful initial build and deployment](https://github.com/KiBk/sicily/actions/runs/39063641873).
- Source SHA-256: `57adcddd806730f6a8ecf5effbd187e9a8bfa867046f6b5af767411eec25dc99`.
- `make check-private` passed locally, including original-to-public route and photo checks.
- A clean clone with no private inputs passed `make check` without changing generated files. GitHub's check job also passed.
- `make verify` matched all **73 served files** byte-for-byte: healthz, HTML, Markdown, JavaScript/CSS, map data, nine GPX files, ZIP and 52 WebP assets.
- Live browser checks passed for all eight stage titles/statistics, cross-stage photo navigation, real image loading, Enna (€35 shared) and Lentini (€65 separate) stay popups, and stage-8 deep-link reload.
- A 390 × 844 viewport had no page overflow; stage selection and photo navigation worked. The overview was restored after testing. No browser warnings or errors were recorded in the final live test.

Physical touch swipes and Mac pinch feel remain real-device checks, not claims established by browser automation. GitHub's successful run reported a non-blocking Node 20 dependency deprecation in an official Pages action and an upcoming `ubuntu-latest` image migration; the deployment completed successfully.

- Only `website/recap/public/` is included in the Pages artifact.
- Eight recorded routes, 26 photos, seven stays and nine personal notes.
- All recorded track copies omit the final 500.1 m. Original Garmin files and original photo/video files remain ignored and local.
- Public CI uses reviewed asset hashes and needs no private inputs.
- Repository history, planning website, personal homepage and DNS are preserved.

## Lowercase address · 18 October 2026

The existing repository was renamed from `KiBk/Silicy` to `KiBk/sicily`, correcting both the spelling and capitalization. The new canonical website address is **https://kibk.net/sicily/**. This is the same repository (GitHub ID `1351449230`), not a replacement or a new project. The local checkout keeps its existing directory name.

All maintained website/download URLs and the local Git remote are updated. GitHub repository links redirect automatically; the old `/Silicy/` Pages address does not. Route geometry, photos, source facts and the privacy cut are unchanged.

[Deployment 39150106999](https://github.com/KiBk/sicily/actions/runs/39150106999) passed for commit `16b122aba1e53488f92224aca56966a0dbbfa239`. `make verify` matched all 73 public files at the lowercase address. Browser verification confirmed the overview, stage-8 selection and deep-link reload under `/sicily/`. The URL without a trailing slash resolves to the HTTPS site successfully. The site-source hash and all reviewed data/photo hashes remain unchanged.
