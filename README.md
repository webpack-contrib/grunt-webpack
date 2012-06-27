# grunt-webpack

Use [modules-webpack](https://github.com/sokra/modules-webpack/) with grunt.

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
    src: "client/lib/index.js",
    dest: "asserts/[hash].js",
    // all other webpack options here:
    scriptSrcPrefix: "asserts/", // i.e.
    // one extra option for grunt-webpack
    statsTarget: "xyz", // writes the status to a variable named xyz
    // you may use it later in grunt i.e. <%= xyz.hash %>
  },
  anotherName: {...}
}
```

`grunt-webpack` uses the [programmatically interface](https://github.com/sokra/modules-webpack#programmatically-usage).

The `watch` option is not valid for compiling with `grunt`, you have to use the watch function of grunt.

## License
Copyright (c) 2012 Tobias Koppers @sokra  
Licensed under the MIT license.
