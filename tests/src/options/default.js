import test from 'ava';
import { gruntOptions } from '../../../src/options/default';

test('keepalive without watch', (t) => {
  t.is(gruntOptions.keepalive({}), false);
});

test('keepalive with watch true', (t) => {
  t.is(gruntOptions.keepalive({ watch: true }), true);
});

test('keepalive with watch false', (t) => {
  t.is(gruntOptions.keepalive({ watch: false }), false);
});

test('keepalive without watch in array', (t) => {
  t.is(gruntOptions.keepalive([{}]), false);
});

test('keepalive with watch true in array', (t) => {
  t.is(gruntOptions.keepalive([{ watch: true }]), true);
});

test('keepalive with watch false in array', (t) => {
  t.is(gruntOptions.keepalive([{ watch: false }]), false);
});
