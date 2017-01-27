import test from 'ava';
import WebpackOptionHelper from '../../../src/options/WebpackOptionHelper';

test('cache is enabled in watch mode', (t) => {
  const options = { watch: true, cache: true };
  const helper = new WebpackOptionHelper();

  const result = helper.filterOptions(options);

  t.true(result.cache);
});

test('cache is disabled in normal mode', (t) => {
  const options = { watch: false, cache: true };
  const helper = new WebpackOptionHelper();

  const result = helper.filterOptions(options);

  t.false(result.cache);
});
