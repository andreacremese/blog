---
title: The case for named functions expressions
date: 2016-08-18 17:04:36
tags:
	- JS
	- Best Practices
---

JS developers use function expression in a myriad of cases: from handlers to callbacks. In this brief article, inspired by [@getify](https://twitter.com/getify), I advocate the use of **namedfunction expression**  in Lieu if just function expressions (anonymous function).

As a refresher, inspired by [mozilla development network](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function):

``` javascript
function log() {
	console.log("I am a function declaration");
}

var fun = function () {
	console.log("I am a function expression");
};

var fun2 = function fun2(){
	console.log("I am a named function expression!")
};
```

And just as a further refresher, function declaration are **hoisted**. Extremely briefly: Javascript code is analyzed before being executed and, during this passage, the bindings for the variables and functions declarations are created in the current scope (or the global scope, if you are not in `strict mode` and start assigning values to variables that are not yet declared).

In the case of function declarations, the body of the function is as well hoisted, while for variables they initially are undefined. This makes function which are declared available for use before they are actually declared. Function expressions are treated like a variable, with a binding being created by having the undefined value. 

Also, declaration do not need a semicolon afterwards, while expressions should be followed by a semicolon. I know that this is not critical thanks to [automatic semicolon insertion](http://www.ecma-international.org/ecma-262/5.1/#sec-7.9), but it is still worth mentioning - especially if you have a Linter on.

# The case for Named Function Expression

Now, using named function expressions seems a bit redundant. What seems to be wrong about just shoving an anonymous function in a variable? **The reason to use named function expression is mainly to facilitate debugging.**

When an unhandled exception is thrown by a function expression, the stack trace usually looks something like `VM224:2 Uncaught  ReferenceError: name is not defined (anonymous function) @ VM224:2`. In all effects, all we know is that there is an anonymous function that threw. Very helpful...

Aggravating the situation, if the function / handler is buried deep into the code base, the stack trace at the exception may be half a dozen anonymous functions - making debugging a real treat. 

If the function is named, the error is much more meaningful. In addition, the code is more verbose and self documenting for our fellow developers. 

``` javascript
var user = {
	name : "Andrea"
};

// function expression
setTimeout(function () {
	console.log(user.credentials.name);
}, 1000);

// will throw Uncaught TypeError: Cannot read property 'name' of undefined (anonymous function) @ VM503:7


// function expression
setTimeout(function getUserName() {
	console.log(user.credentials.name);
}, 1000);

// will instead throw a more useful exception with the name of the throwing function
// VM504:3 Uncaught TypeError: Cannot read property 'name' of undefined getUserName @ VM504:3



//... for iifes too!
(function someNewNameHere() {
	throw new Error("Now you know when it throws!");
}());

// VM672:2 Uncaught Error: Now you know when it throws!(…)someNewNameHere @ VM672:2(anonymous function) @ VM672:3
```