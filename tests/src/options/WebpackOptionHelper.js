import test from 'ava';
import WebpackOptionHelper from '../../../src/options/WebpackOptionHelper';

test('cache stays enabled in watch mode', (t) => {
  const options = { watch: true, cache: true };
  const helper = new WebpackOptionHelper();

  const result = helper.filterOptions(options);

  t.true(result.cache);
});

test('cache is enabled in watch mode by default', (t) => {
  const options = { watch: true, cache: () => true };
  const helper = new WebpackOptionHelper();

  const result = helper.filterOptions(options);

  t.true(result.cache);
});

test('cache is disabled in normal mode by default', (t) => {
  const options = { watch: false, cache: () => true };
  const helper = new WebpackOptionHelper();

  const result = helper.filterOptions(options);

  t.false(result.cache);
});

test('cache is disabled in normal mode', (t) => {
  const options = { watch: false, cache: true };
  const helper = new WebpackOptionHelper();

  const result = helper.filterOptions(options);

  t.false(result.cache);
});

test('watch options is part of webpack options', (t) => {
  const options = { watch: true, watchOptions: { aggregateTimeout: 300, poll: 1000 } };
  const helper = new WebpackOptionHelper();

  helper.getOptions = () => options;

  const result = helper.getWebpackOptions();

  t.deepEqual(result, { watch: true, watchOptions: { aggregateTimeout: 300, poll: 1000 } });
});
