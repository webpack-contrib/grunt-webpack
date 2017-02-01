[![npm][npm]][npm-url]
[![deps][deps]][deps-url]
[![test][test]][test-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]

<div align="center">
  <!-- replace with accurate logo e.g from https://worldvectorlogo.com/ -->
  <img width="200" height="200"
    src="https://cdn.worldvectorlogo.com/logos/grunt.svg">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" vspace="" hspace="25"
      src="https://cdn.rawgit.com/webpack/media/e7485eb2/logo/icon.svg">
  </a>
  <h1>Grunt Webpack</h1>
  <p>Use Webpack with Grunt.<p>
</div>

  **This is the readme for version 2.0 which is currently available as beta version. For the 1.0 readme visit [here](https://github.com/webpack-contrib/grunt-webpack/tree/1.0).**

<h2 align="center">Install</h2>

Install this grunt plugin next to your project's [Gruntfile.js](http://gruntjs.com/getting-started). You also need to install webpack yourself, this grunt plugin does not install webpack itself.

```bash
yarn add webpack grunt-webpack
```

If you also want to use the webpack-dev-server task you also need to install `webpack-dev-server`

```bash
yarn add webpack-dev-server
```

Then add this line to your project's `Gruntfile.js` gruntfile:

```javascript
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({ ... });

  grunt.loadNpmTasks('grunt-webpack');
};
```

## Configuration

### Both Tasks

#### progress
Type: `bool`
Default: `true` (`false` if no TTY present)

Activates or deactivates the progress output of webpack.

#### keepalive
Type: `bool`
Default: `false` (`true` if watch mode is used and for webpack-dev-server)

Activates or deactivates the progress output of webpack.

### Webpack Task

#### failOnError
Type: `bool`
Default: `true` (`false` if watch mode is used)

> TODO this is not true currently, it is not disabled when watchmode used

Terminate the grunt process when an error happens if set to `true`. If set to `false` the grunt process will not be immediately terminated on error and instead still run tasks scheduled to run after the webpack task.

#### storeStatsTo
Type: `string`
Default: `null`

When set the stats from webpack will be written to a variable with the name provided in this option. The variable can later be used inside of other grunt tasks with template tags <%= %>.

```js
...
storeStatsTo: "webpackStats"

...

<%= webpackStats.hash %>
...
```

> For more information about grunt template tags have a look at the [grunt docs][2].

### Webpack-dev-server Task

#### inline
Type: `bool`
Default: `false`

Enable inline mode to include client scripts in bundle.

> see the [webpack documentation][1] for more information about this option.

## Examples


### old

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
	// stats: false disables the stats output

	storeStatsTo: "xyz", // writes the status to a variable named xyz
	// you may use it later in grunt i.e. <%= xyz.hash %>

	progress: false, // Don't show progress
	// Defaults to true

	failOnError: false, // don't report error to grunt if webpack find errors
	// Use this if webpack errors are tolerable and grunt should continue

	watch: true, // use webpacks watcher
	// You need to keep the grunt process alive

	watchOptions: {
		aggregateTimeout: 500,
		poll: true
	},
	// Use this when you need to fallback to poll based watching (webpack 1.9.1+ only)

	keepalive: true, // don't finish the grunt task
	// defaults to true for watch and dev-server otherwise false

	inline: true,  // embed the webpack-dev-server runtime into the bundle
	// Defaults to false

	hot: true, // adds the HotModuleReplacementPlugin and switch the server to hot mode
	// Use this in combination with the inline option

  },
  anotherName: {...}
}
```

`grunt-webpack` uses the [webpack options](http://webpack.github.io/docs/configuration.html).

<h2 align="center">Maintainers</h2>

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars1.githubusercontent.com/u/231804?v=3&s=150">
        </br>
        <a href="https://github.com/danez">Daniel Tschinder</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/166921?v=3&s=150">
        </br>
        <a href="https://github.com/bebraw">Juho Vepsäläinen</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars2.githubusercontent.com/u/8420490?v=3&s=150">
        </br>
        <a href="https://github.com/d3viant0ne">Joshua Wiens</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/533616?v=3&s=150">
        </br>
        <a href="https://github.com/SpaceK33z">Kees Kluskens</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars3.githubusercontent.com/u/3408176?v=3&s=150">
        </br>
        <a href="https://github.com/TheLarkInn">Sean Larkin</a>
      </td>
    </tr>
  <tbody>
</table>


[1]: https://webpack.js.org/configuration/dev-server/#devserver-inline-cli-only
[2]: http://gruntjs.com/api/grunt.template

[npm]: https://img.shields.io/npm/v/grunt-webpack.svg
[npm-url]: https://npmjs.com/package/grunt-webpack

[deps]: https://david-dm.org/webpack-contrib/grunt-webpack.svg
[deps-url]: https://david-dm.org/webpack-contrib/grunt-webpack

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

[test]: https://travis-ci.org/webpack-contrib/grunt-webpack.svg?branch=master
[test-url]: https://travis-ci.org/webpack-contrib/grunt-webpack

[cover]: https://codecov.io/gh/webpack-contrib/grunt-webpack/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/grunt-webpack
