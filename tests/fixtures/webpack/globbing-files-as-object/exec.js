assertGrunt.success();

const content1 = fs.readFileSync(path.join(cwd, 'output-h.js'), 'utf-8');
t.regex(content1, /Hello/);
t.regex(content1, /Hi/);

const content2 = fs.readFileSync(path.join(cwd, 'output-w.js'), 'utf-8');
t.regex(content2, /World/);
t.regex(content2, /Washington/);
