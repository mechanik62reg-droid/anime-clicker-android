# Anime Clicker — Roadmap to v25

## Verified repository status (2026-11-27)
- Latest project archive available on branch `v21-bosses`: `Anime_Clicker_v22.zip`.
- GitHub Actions successfully built a debug APK from v22 on 2026-11-26; APK artifact is 4.28 MB and expires 2026-12-10.
- Repository contains packaged project ZIPs, not the unpacked app source. This run could verify archive metadata and build artifacts, but could not inspect or edit the game's actual JavaScript/assets because network access to raw archive bytes is unavailable in this environment.
- No open Issues were returned; no PRs were open at the time of inspection.

## Roadmap (only increment when gameplay/source changes are actually made)

### v23 — Source access and gameplay QA
- [ ] Make the source available as a normal tracked source directory (or provide a mounted ZIP) so individual files can be reviewed and patched.
- [ ] Add a repeatable test for purchase/upgrade buttons (currency check, purchase, price/cost refresh, UI update).
- [ ] Test save/load and offline progress; ensure upgrades and level/boss progress survive reload.
- [ ] Review touch/scroll behavior on Android; remove unwanted shake and slow auto-scroll.

### v24 — Game feel and content
- [ ] Replace placeholder/weak enemy and boss art with consistent anime-style assets; keep hero silhouettes distinct from enemies.
- [ ] Add a small set of meaningful boss phases/skills, with clear feedback and balanced rewards.
- [ ] Tune upgrade costs, income, boss HP, and progression pacing using actual playtest data.
- [ ] Improve click/skill sounds and optional volume controls.

### v25 — Release readiness
- [ ] Test narrow and wide phone layouts, safe areas, touch targets, and performance.
- [ ] Verify save migration/backward compatibility and reset behavior.
- [ ] Check build, APK install/start, regression tests, and final smoke test on a real Android device.
- [ ] Produce a release candidate APK and a clean ZIP/source package; do not publish a public release without user approval.

## Build pipeline improvement in this branch
- Manual build allows selecting the existing v17/v19/v20/v21/v22 source archives.
- Build validates ZIP integrity and project presence, runs npm tests if the archive defines them, and uploads APK plus build metadata/checksum.
- The APK is still a debug build. No signing keys, secrets, accounts, store releases, or payments were changed.
