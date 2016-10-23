module.exports = function (t, returnCode, stdout) {
  return {
    success: function assertGruntSuccess() {
      t.is(returnCode, 0, `Grunt exited with an error code stdout: "${stdout}"`);

      // t.notRegex(stdout, /Aborted due to warnings./);
    },
    failed: function assertGruntSuccess() {
      t.true(returnCode > 0, `Grunt did not error as expected: "${stdout}"`);

      // t.regex(stdout, /Aborted due to warnings./);
    }
  };
};
