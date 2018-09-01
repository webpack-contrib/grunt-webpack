assertGrunt.success();

const content = fs.readFileSync(path.join(cwd, 'output.js'), 'utf-8');
t.regex(content, /\/\*! Webpack - Version 6.55.345 dated/);

// stats should be displayed by default
t.regex(stdout, /output\.js/);
t.regex(stdout, /\[emitted\]/);
t.regex(stdout, /main/);

