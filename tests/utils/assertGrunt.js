module.exports = function (returnCode, stdout, timeout) {
  return {
    success: function assertGruntSuccess() {
      expect(timeout).toBe(false);
      expect(returnCode).toBe(0);
      expect(stdout).not.toMatch(/ERROR/i);
    },
    failed: function assertGruntFailed() {
      expect(timeout).toBe(false);
      expect(returnCode).toBeGreaterThan(0);
      expect(stdout).toMatch(/ERROR/i);
    },
    timeout: function assertGruntTimeout() {
      expect(timeout).toBe(true);
    },
  };
};
