import test from 'ava';
import path from 'path';
import convertPaths from '../../src/options/convertPaths';

test('relative file path', t => {
  const options = { context: 'hello.js'};

  t.deepEqual(convertPaths(options), { context: path.join(__dirname, 'hello.js') });
});

test('absulute file path', t => {
  const options = { context: '/hello.js'};

  t.deepEqual(convertPaths(options), { context: '/hello.js' });
});
