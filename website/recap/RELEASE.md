# GitHub Pages release

Target: **https://kibk.net/Silicy/**, from the existing public **KiBk/Silicy** repository.

Published and verified **17 October 2026**. GitHub Pages uses HTTPS and the workflow publishing method.

- Release commit: `ea63f3c35d5b9f6d3ac4172415323ccf415d91fe`.
- [Successful initial build and deployment](https://github.com/KiBk/Silicy/actions/runs/39063641873).
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
- Existing repository name, history, planning website, personal homepage and DNS are preserved.
