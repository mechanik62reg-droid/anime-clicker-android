# Anime Clicker — Roadmap to v25

## Verified repository status (2026-11-27)
- Latest packaged game source: v22 archive on `v21-bosses`.
- Existing v22 debug APK built successfully by GitHub Actions on 2026-11-26 (4.28 MB; artifact expires 2026-12-10).
- Source ZIP cannot be fetched into this run's local environment, but the APK contains the complete web game as `assets/public/index.html` (about 719 KB). Static analysis is therefore possible; a full editable source package is still preferred.
- No open Issues returned; no PRs were open before this run.

## v23 — Save-state stability (patch candidate)
- [x] Extracted v22 HTML from the APK for static review.
- [x] Found a numeric-type issue in save loading: values like `coins`/`total` were validated with `Number(...)` but not converted, allowing string concatenation when passive rewards were added.
- [x] Normalize saved numeric fields and sanitize corrupted collections.
- [x] Four Node regression tests pass: numeric-string saves, malformed values, passive income, and upgrade purchase refresh.
- [x] GitHub Actions built the patched v23 debug APK; APK ZIP integrity and embedded patch were checked locally. SHA-256: `079f3eddfc1803214695dabd4ea4294696595a9d236062aefcb8934a07acb0f4`.
- [ ] Install/playtest on an actual Android device; still unverified.

## v24 — Game feel and content
- [ ] Replace placeholder/weak enemy and boss art with consistent anime-style assets; keep hero silhouettes distinct from enemies.
- [ ] Add meaningful boss phases/skills and feedback.
- [ ] Tune upgrade costs, income, boss HP, and progression pacing using playtest data.
- [ ] Improve click/skill sounds and optional volume controls.

## v25 — Release readiness
- [ ] Test narrow and wide phone layouts, safe areas, touch targets, and performance.
- [ ] Verify save migration/backward compatibility and reset behavior.
- [ ] Regression tests, build, APK install/start, and real-device smoke test.
- [ ] Produce a release candidate APK and source package; no public release without user approval.

## Pipeline
- Manual build selection for existing v17/v19/v20/v21/v22 archives.
- ZIP integrity and project presence checks; npm tests if present.
- v23 patch + regression suite applied only when v22 archive is selected.
- Artifact includes APK, build info, and SHA-256 checksum. Debug build only.
