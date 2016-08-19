# Experimenting with Webpack and TNS LiveSync

This project does things differently.

- Instead of using `nativescript-dev-webpack`, it uses vanilla webpack, and throws everything in the local config file.
- All source code is stored in `./src`. The `./app` folder stores images and generated bundles (the latter are gitignored).
- Webpack is the build system - we use it to bundle HTML templates and copy CSS files from `./src` to `./app`.
- Instead of having `tns` trigger a webpack build, we use a simple `npm run` script to bundle scripts, and then do a `tns run ...`
- Even better, we can spawn the webpack watcher, monitor `./src` for changes, and output files in `./app`. There we have our old `tns livesync android --watch` taking the files to the mobile device.
- Why spawn two watchers manually when you can use tools like Foreman, and define all watchers in a `Procfile`? `npm run start-android` starts both watchers for you.

## What do we gain from all this?

- Simple setup without needing to modify the nativescript-cli code.
- *FAST* syncs! The bundle is split in two chunks: `tns-java-classes.js` and `bundle.js`. The former contains all vendor modules (We'll rename it to `vendor.js` eventually, see below.). The latter contains just the app code, which in our case is about 2.5 KB. The *only* file that usually gets synced is `bundle.js`. And it happens instantly.
- Decoupled directory structure from the current nativescript-cli assumptions. We can now move our source code around, place it next to web platform code, and share certain Angular services.

## Running the project

1. `tns install`
2. `npm run start-android`
3. (Edit `ts`, `html`, `css` files, and enjoy fast device syncs).

## What needs more work

- Currently Android only. To make it work on iOS, we need either runtime support similar to the Android runtime `runModule` Java API (This is what we have for `tns-java-classes.js` now), or a shim module that executes chunk files in the correct order. This can be as simple as an entrypoint module that `require`'s chunk files in the expected order.
- We use `tns-java-classes.js` as the vendor chunk simply out of convenience because the Android runtime has magic support for that. Perhaps we should build the JS shim solution mentioned in the previous point and apply it both to Android and iOS builds.
- Another point in favor of the software solution -- we can set up a runtime `window["nativeScriptJsonp"]` function in a way that is a lot less fragile than the current regex-based `FixJsonpPlugin` webpack plugin.
- This project doesn't use webpack's hot module reloading feature. We'll explore that elsewhere.
- Images and App\_Resources are stored below `./app`. We should move them somewhere else, and `CopyWebPackPlugin` them to `./app`.
- Figure out the fastest webpack dev build settings: sourcemaps, forked typechecker plugin, babel caching, etc. 
- 
