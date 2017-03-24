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
yarn add webpack grunt-webpack --dev
```

You can still use npm

```bash
npm i webpack grunt-webpack --save-dev
```

If you also want to use the webpack-dev-server task you also need to install `webpack-dev-server`

```bash
yarn add webpack-dev-server --dev
```

Then add this line to your project's `Gruntfile.js` gruntfile:

```javascript
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({ ... });

  grunt.loadNpmTasks('grunt-webpack');
};
```

<h2 align="center">Configuration</h2>

`webpack-grunt` offers two different tasks `webpack` and `webpack-dev-server`. Both support all webpack options as 
can be seen in the [webpack documentation][3]. For exceptions and additions see this list.

### Both Tasks

#### progress
Type: `bool`
Default: `true` (`false` if no TTY present)

Activates or deactivates the progress output of webpack.

#### keepalive
Type: `bool`
Default: `false` (`true` if watch mode is used and for webpack-dev-server)

When set to true the grunt process will be kept alive after webpack is finished.

### Webpack Task

#### failOnError
Type: `bool`
Default: `true` (`false` if watch mode is used)

Terminate the grunt process when an error happens if set to `true`. If set to `false` the grunt process will not be immediately terminated on error and instead still run tasks scheduled to run after the webpack task.

#### storeStatsTo
Type: `string`
Default: `null`

When set the stats from webpack will be written to a variable with the name provided in this option. The variable can later be used inside of other grunt tasks with template tags `<%= %>`.

```js
...
storeStatsTo: "webpackStats"

...

<%= webpackStats.hash %>
...
```

> For more information about grunt template tags have a look at the [grunt docs][2].

### Webpack-dev-server Task

The webpack-dev-server options [`host`][5], [`hotOnly`][6], [`inline`][1], [`port`][4] and [`public`][7] which are usually only available in the CLI can also be used in this grunt-plugin.

<h2 align="center">Examples</h2>

### Webpack

This is a simple example that requires the webpack config from the config file.
It also disables stats in non 'development' environments and enables watch in development.

``` javascript
const webpackConfig = require('./webpack.config');

module.exports = function(grunt) {
  grunt.initConfig({
    webpack: {
      options: {
        stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
      },
      prod: webpackConfig,
      dev: Object.assign({ watch: true }, webpackConfig);
    }
  });

  grunt.loadNpmTasks('grunt-webpack');
};
```

> The webpack task in this example has two targets called `prod` and `dev`. They can be renamed to everything besides `options`. See the [grunt docs][2] for more information about targets.

On the command line you can then do the following.

```bash
# Run webpack with the `prod` target
> NODE_ENV='production' grunt webpack:prod

# Run webpack with the `dev` target
> grunt webpack:dev

# Run webpack for all targets
> grunt webpack
```

> For more examples ind information have a look at the [webpack documentation][9] which mostly also applies here besides the noted differences above.

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
[3]: https://webpack.js.org/configuration/
[4]: https://webpack.js.org/configuration/dev-server/#devserver-port-cli-only
[5]: https://webpack.js.org/configuration/dev-server/#devserver-host-cli-only
[6]: https://webpack.js.org/configuration/dev-server/#devserver-hotonly-cli-only
[7]: https://webpack.js.org/configuration/dev-server/#devserver-public-cli-only
[8]: https://gruntjs.com/configuring-tasks#task-configuration-and-targets
[9]: https://webpack.js.org/guides/get-started/

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
