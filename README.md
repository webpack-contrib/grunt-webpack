# grunt-webpack

Use [webpack](https://github.com/webpack/webpack) with grunt.

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile](https://github.com/cowboy/grunt/blob/master/docs/getting_started.md) with: `npm install grunt-webpack`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-webpack');
```

## Configuration Example

``` javascript
webpack: {
  someName: {
    // webpack options
    entry: "./client/lib/index.js",
    output: {
	  path: "asserts/",
	  filename: "[hash].js",
	},

	stats: {
	  // Configure the console output
	  colors: false,
	  modules: true,
	  reasons: true
	},

    storeStatsTo: "xyz", // writes the status to a variable named xyz
    // you may use it later in grunt i.e. <%= xyz.hash %>

    failOnError: false, // don't report error to grunt if webpack find errors
    // Use this if webpack errors are tolerable and grunt should continue
  },
  anotherName: {...}
}
```

`grunt-webpack` uses the [webpack options](https://github.com/webpack/docs/wiki/webpack-options).

The `watch` option is not valid for compiling with `grunt`, you have to use the watch function of grunt.

## License
Copyright (c) 2012-2013 Tobias Koppers @sokra
Licensed under the MIT license.
