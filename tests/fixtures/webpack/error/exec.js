assertGrunt.failed();

t.regex(stdout, /Can't resolve '\.\/b'/);
t.regex(stdout, /@ \.\/entry\.js 1:8-22/);
