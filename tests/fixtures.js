import test from 'ava';
import path from 'path';
import { transform } from 'babel-core';
import envPreset from 'babel-preset-env';
import fs from 'fs-extra';
import glob from 'glob';
import { spawn } from 'child_process';
import assertGruntFactory from './utils/assertGrunt';

const TMP_DIRECTORY = path.join(__dirname, 'tmp');
const GRUNT_BIN = path.join(__dirname, '../node_modules/.bin/grunt');

const files = glob.sync(path.join(__dirname, 'fixtures/**/Gruntfile.js'), { dot: true });
const tests = new Map();

function runExec(code, opts) {
  const sandbox = Object.assign(
    {
      fs,
      path,
      assertGrunt: assertGruntFactory(opts.t, opts.returnCode, opts.stdout),
    },
    opts
  );

  const execCode = transform(
    code,
    {
      ast: false,
      sourceMaps: false,
      compact: true,
      comments: false,
      presets: [
        [envPreset, { targets: { node: 'current'} }]
      ]
    }
  ).code;

  let fn = new Function(...Object.keys(sandbox), execCode);
  return fn.apply(null, Object.keys(sandbox).map(key => sandbox[key]));
}

files.forEach((file) => {
  const directory = path.dirname(file);
  const relativeDirectory = path.relative(path.join(__dirname, 'fixtures'), directory);
  const name = relativeDirectory.replace(/\//g, ' ');
  const cwd = path.join(TMP_DIRECTORY, relativeDirectory);

  tests.set(name, { cwd, directory, relativeDirectory });
});

test.before(() => {
  tests.forEach(({ cwd, directory }) => {
    fs.mkdirsSync(cwd);
    fs.copySync(directory, cwd);
  });
});

test.after(() => {
  fs.removeSync(TMP_DIRECTORY);
});

tests.forEach(({ cwd, relativeDirectory }, name) => {
  const directoryParts = relativeDirectory.split('/');
  const testFunc = directoryParts.pop().startsWith('.') ? test.skip : test;

  testFunc.cb(name, (t) => {
    let optionsLoc = path.join(cwd, 'options.json');
    let options;
    if (fs.existsSync(optionsLoc)) {
      options = require(optionsLoc);
    } else {
      options = { args: [directoryParts.shift()] };
    }

    options.args.unshift('--stack');

    const execLoc = path.join(cwd, 'exec.js');
    let execCode;
    if (fs.existsSync(execLoc)) {
      execCode = fs.readFileSync(execLoc, 'utf-8');
    }
    const grunt = spawn(GRUNT_BIN, options.args, { cwd });

    let stdout = '';
    let stderr = '';
    grunt.stdout.on('data', (data) => { stdout += data.toString(); });
    grunt.stderr.on('data', (data) => { stderr += data.toString(); });
    grunt.on('close', (returnCode) => {
      if (execCode) runExec(execCode, { t, returnCode, cwd, stderr, stdout });
      t.end();
    });
  })
});
