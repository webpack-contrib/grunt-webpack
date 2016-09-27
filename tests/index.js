import test from 'ava';
import grunt from 'grunt';
import path from 'path';
import fs from 'fs-extra';
import glob from 'glob';
import webpack from 'webpack';

function prepareGrunt(config) {
  // disable loading of Gruntfile.js
  grunt.task.init = () => {};

  grunt.loadTasks(path.join(__dirname, '../tasks'));
  grunt.initConfig(config);
}

const files = glob.sync(path.join(__dirname, 'fixtures/**/config.js'));

const tasks = [];
const executionList = {};
const completeConfig = {
  webpack: {},
  "webpack-dev-server": {},
};

files.forEach(file => {
  const config = require(file);
  const directory = path.dirname(file);
  const parts = path.relative(path.join(__dirname, 'fixtures'), directory).split('/');
  const plugin = parts.shift();
  const name = parts.join('_');

  completeConfig[plugin][name] = Object.assign(
    {},
    config.grunt,
    {
      plugins: [
        ...config.grunt.plugins,
        // extract runtime into common so we don't diff it
        new webpack.optimize.CommonsChunkPlugin({name: 'common', filename: 'common.js', minChunks: 42}),
      ],
      stats: false
    }
  );
  executionList[`${plugin} ${name.replace(/_/g, ' ')}`] = directory;
});

prepareGrunt(completeConfig);

test.before(async t => {
  await new Promise(resolve => grunt.tasks('webpack', { stack: true }, () => resolve()));
});

Object.keys(executionList).forEach(trigger => {
  const directory = executionList[trigger];
  test(trigger, t => {
    const actualFolder = path.join(directory, 'actual');
    const expectedFolder = path.join(directory, 'expected');

    const expectedFiles = glob.sync(path.join(expectedFolder, '*.js')).filter(file => !file.match(/common\.js$/));

    if (expectedFiles.length === 0) {
      fs.copySync(actualFolder, expectedFolder);
      t.pass();
      return;
    }

    expectedFiles.forEach(expectedFile => {
      const actualFile = expectedFile.replace('/expected/', '/actual/');

      let actualContent;
      try {
        actualContent = fs.readFileSync(actualFile, 'utf-8');
      } catch (e) {
        t.fail(`Expected actual file to exist. ${actualFile}`);
      }
      const expectedContent = fs.readFileSync(expectedFile, 'utf-8');

      if (actualContent !== expectedContent) {
        // TODO maybe output a diff
        t.fail(`Expected and actual file does not match. ${actualFile}`);
      }
    });
  });
});

