module.exports = function (t, returnCode, stdout) {
  return {
    success: function assertGruntSuccess() {
      t.is(returnCode, 0, `Grunt exited with an error code. stdout: "${stdout}"`);

      t.notRegex(stdout, /ERROR/i, `Webpack seems to run into an error. stdout: "${stdout}"`);
    },
    failed: function assertGruntSuccess() {
      t.true(returnCode > 0, `Grunt did not error as expected: "${stdout}"`);

      t.regex(stdout, /ERROR/i);
    }
  };
};
