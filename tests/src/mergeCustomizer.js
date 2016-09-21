import test from 'ava';
import mergeCustomizer from '../../src/mergeCustomizer';

test('two arrays', t => {
  const a = ['a'];
  const b = ['b'];
  const result = mergeCustomizer(a, b);

  t.deepEqual(result, ['a', 'b']);
  t.not(result, a);
  t.not(result, b);
});

test('array and string', t => {
  const a = ['a', 'c'];
  const b = 'b';
  const result = mergeCustomizer(a, b);

  t.deepEqual(result, ['b', 'b']);
  t.not(result, a);
});

test('array and object', t => {
  const a = ['a', 'c'];
  const b = {};
  const result = mergeCustomizer(a, b);

  t.deepEqual(result, [{}, {}]);
  t.not(result, a);
});

test('string and array', t => {
  const a = 'b';
  const b = ['a', 'c'];
  const result = mergeCustomizer(a, b);

  t.deepEqual(result, ['a', 'c']);
  t.not(result, b);
});

test('array and object', t => {
  const a = {};
  const b = ['a', 'c'];
  const result = mergeCustomizer(a, b);

  t.deepEqual(result, ['a', 'c']);
  t.not(result, b);
});
