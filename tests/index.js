import test from 'ava';
import grunt from 'grunt';
import path from 'path';
import fs from 'fs-extra';
import glob from 'glob';
import webpack from 'webpack';

function prepareGrunt(config) {
  config.webpack.a.plugins.push( // extract runtime into common so we don't diff it
    new webpack.optimize.CommonsChunkPlugin({ name: 'common', filename: 'common.js', minChunks: 99 })
  );

  // disable loading of Gruntfile.js
  grunt.task.init = () => {};

  grunt.loadTasks(path.join(__dirname, '../tasks'));
  grunt.initConfig(config);
}

const files = glob.sync(path.join(__dirname, 'fixtures/**/config.js'));

files.forEach(file => {
  const directory = path.dirname(file);
  const name = path.basename(directory);

  test.cb(`webpack ${name}`, t => {
    const config = require(file);
    prepareGrunt(config.grunt);
    grunt.tasks(config.run, {}, () => {
      const actualFolder = path.join(directory, 'actual');
      const expectedFolder = path.join(directory, 'expected');

      const expectedFiles = glob.sync(path.join(expectedFolder, '*.js')).filter(file => !file.endsWith('common.js'));

      if (expectedFiles.length === 0) {
        fs.copySync(actualFolder, expectedFolder);
        t.pass();
        t.end();
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

      t.end();
    });
  });
});
