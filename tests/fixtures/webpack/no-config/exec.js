assertGrunt.failed();

t.regex(stdout, /No configuration was found for webpack./);
