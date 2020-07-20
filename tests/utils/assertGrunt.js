module.exports = function (returnCode, stdout) {
  return {
    success: function assertGruntSuccess() {
      expect(returnCode).toBe(0);
      expect(stdout).not.toMatch(/ERROR/i);
    },
    failed: function assertGruntSuccess() {
      expect(returnCode).toBeGreaterThan(0);
      expect(stdout).toMatch(/ERROR/i);
    }
  };
};
