// getChildScripts returns scripts in source order.

// XXX bug 693754 disabled
/*
var g = newGlobal('new-compartment');
var dbg = new Debugger(g);
var scripts = [];
var cs;
dbg.onDebuggerStatement = function (frame) {
    scripts.push(frame.script);
    if (scripts.length === 1)
        cs = frame.script.getChildScripts();
};

g.eval("function f() { debugger; }\n" +
       "var g = function () { debugger; }\n" +
       "debugger; f(); g();");

assertEq(scripts.length, 3);
assertEq(cs.length, 2);
assertEq(cs[0], scripts[1]);
assertEq(cs[1], scripts[2]);
*/
