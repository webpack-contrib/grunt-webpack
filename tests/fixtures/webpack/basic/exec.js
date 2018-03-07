assertGrunt.success();

const content = fs.readFileSync(path.join(cwd, 'output.js'), 'utf-8');
t.regex(content, /console\.log\("dokey"\)/);

// stats should be displayed by default
t.regex(stdout, /output\.js/);
t.regex(stdout, /\[emitted\]/);
t.regex(stdout, /main/);

