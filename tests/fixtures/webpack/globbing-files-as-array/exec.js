assertGrunt.success();

const content = fs.readFileSync(path.join(cwd, 'output.js'), 'utf-8');
t.regex(content, /Hello/);
t.regex(content, /World/);
t.regex(content, /Welcome/);
