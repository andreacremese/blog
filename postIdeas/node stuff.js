node stuff.js

INtroduction course
Review the key parts of node introduction

Try the async question with. Fork and settimeout

 interval and with settimeout instead of setinterval sample
 Have a sample done with events in node rather than with callbacks or promises

 _.get questionwith moka and should



 Skin the Writable stream, readable stream

 Setup test environment for node and c #, ready to clone and start for development with it.only and it.skip





 Breaking super


 class P {
    foo() { console.log( "P.foo" ); }
}

class C extends P {
    foo() {
        super();
    }
}

var c1 = new C();
c1.foo(); // "P.foo"

var D = {
    foo: function() { console.log( "D.foo" ); }
};

var E = {
    foo: C.prototype.foo
};

// Link E to D for delegation
Object.setPrototypeOf( E, D );

E.foo(); // "P.foo"  <-- not D.foo

