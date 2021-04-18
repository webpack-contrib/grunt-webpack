import path from "path";
import crypto from "crypto";
import { transform } from "@babel/core";
import envPreset from "@babel/preset-env";
import fs from "fs-extra";
import glob from "fast-glob";
import { spawn } from "child_process";
import assertGruntFactory from "../utils/assertGrunt";

const TMP_DIRECTORY = path.join(__dirname, "tmp");
const GRUNT_BIN = path.join(__dirname, "../../node_modules/.bin/grunt");

const files = glob.sync(path.join(__dirname, "fixtures/**/Gruntfile.js"), {
  dot: true,
});
const tests = new Map();

function runExec(code, opts) {
  const sandbox = Object.assign(
    {
      fs,
      path,
      assertGrunt: assertGruntFactory(
        opts.returnCode,
        opts.stdout,
        opts.timeout,
      ),
    },
    opts,
  );

  const execCode = transform(code, {
    ast: false,
    sourceMaps: false,
    compact: true,
    comments: false,
    presets: [[envPreset, { targets: { node: "current" } }]],
  }).code;

  let fn = new Function(...Object.keys(sandbox), execCode);
  return fn.apply(null, Object.values(sandbox));
}

files.forEach((file) => {
  const directory = path.dirname(file);
  const relativeDirectory = path.relative(
    path.join(__dirname, "fixtures"),
    directory,
  );
  const name = relativeDirectory.replace(/\//g, " ");

  tests.set(name, { directory, relativeDirectory });
});

describe("Fixture Tests", () => {
  let cwd;
  beforeEach(async () => {
    cwd = path.join(
      TMP_DIRECTORY,
      "integration",
      crypto.randomBytes(20).toString("hex"),
    );
    await fs.ensureDir(cwd);
  });
  afterEach(async () => {
    await fs.remove(cwd);
    cwd = null;
  });
  afterAll(async () => {
    await fs.remove(TMP_DIRECTORY);
  });

  tests.forEach(({ directory, relativeDirectory }, name) => {
    const directoryParts = relativeDirectory.split("/");
    const testFunc = directoryParts.pop().startsWith(".") ? test.skip : test;

    testFunc(
      name,
      async () => {
        await fs.copy(directory, cwd);
        let optionsLoc = path.join(cwd, "options.json");
        let options;
        if (await fs.exists(optionsLoc)) {
          options = require(optionsLoc);
        } else {
          options = {
            args: [directoryParts.shift()],
          };
        }

        options.args.unshift("--stack");

        const execLoc = path.join(cwd, "exec.js");
        let execCode;
        if (await fs.exists(execLoc)) {
          execCode = await fs.readFile(execLoc, "utf-8");
        }
        const grunt = spawn(GRUNT_BIN, options.args, { cwd });

        let stdout = "";
        let stderr = "";
        grunt.stdout.on("data", (data) => {
          stdout += data.toString();
        });
        grunt.stderr.on("data", (data) => {
          stderr += data.toString();
        });

        return new Promise((resolve) => {
          const timeout = setTimeout(() => {
            grunt.removeAllListeners();
            const killed = grunt.kill();
            if (!killed) console.error("cannot kill grunt");
            finish({ timeout: true });
          }, 5000);

          const finish = (result) => {
            clearTimeout(timeout);
            if (execCode) runExec(execCode, { cwd, stderr, stdout, ...result });
            resolve();
          };

          grunt.on("close", (returnCode) => {
            finish({ returnCode, timeout: false });
          });
        });
      },
      10000,
    );
  });
});
