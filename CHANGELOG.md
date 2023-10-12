# Changelog

## 1.0.0 (2023-08-21)


### Features

* add alternate listAllFiles that traverses subdirs (GSF-5947) 0547c90
* added dsconfig CLI for design-system-configurator npm task FUI-1075 (#48) 7e29219
* set up prettier with eslint PTC-435 ed9d5f0
* set up prettier.js PTC-435 33e979a
* bump server version to 6.5.1 FUI-1130 9fcbe39
* enable initSSO configuration in genx FUI-899 5d6b2ea
* initSSO without the full bundle FUI-899 6a27a9b
* lockdown genesis, deployment plugin, kotlin and auth version and remove related questions from genx to reduce support issues with users entering in incorrect or incompatible values PTC-445 4172736
* lockdown genesis, deployment plugin, kotlin and auth version and remove related questions from genx to reduce support issues with users entering in incorrect or incompatible values PTC-445 db90124
* remove styles for entity manager that are part of library PTC-801 506d6ef
* switching Web client to the Genx CLI build FUI-1382 (#62) 2977141
* update deps and fix login breaking change 4c1b756


### Bug Fixes

* add functionality to luminance toggle button FUI-898 dfbeb2c
* Add genesis-config dependency so sysdef compiles on the IDE. PTC-694 (#24) 6fd30aa
* Add genesis-config dependency so sysdef compiles on the IDE. PTC-694 (#24) (#25) c39e911
* address npx lerna using v7 and failing - FUI-1407 (#59) 1a362db
* body font not being picked up issue resolved FUI-1390 (#64) 0b9b187
* ensuring ENABLE_SSO env var is processed correctly PSD-4 (#68) eb29eaf
* excluding all zip files in the lib's distribution folder. PTC-688 (#26) 599ebed
* Fixed an issue where the dependencies weren't being copied to the expected place for the docker-compose (#21) 8cc8367
* improve filter for file writing so no files are missed (GSF-5947) a79e97d
* make sure line endings are in unix format in .sh file PA-324 (#27) 0896a95
* overwrites files based on configuration c2f9ec7
* proper way to include library 4a7852e
* removed alpha and fast ds registration FUI-1433 (#65) 0a90c3f
* site specific publication now uses app name instead of being hardcoded (GSF-5947) 23b4248
* stop duplicate error appearing in project: PTC-809 (#30) d4d6fe5
* update login route configs to match latest foundation-login - FUI-1025 2a62f2f
* using fs-extra in the seed instead of as exported dependency from the foundation-cli cb39aba
* using latest fs-extra version a1e34e1
* using the move function 4555360
