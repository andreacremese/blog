---
title: What is -this- (in JS)?
date: 2016-08-22 15:11:44
tags:
	- JS
---
In this brief article I'll discuss on the subject of `this` in JS's function execution context. There is quite a number of guides on this (very important) subject, but after some reading I decided it was worth putting down 'my' approach (see the disclaimer) to this subject. 

# So, what is this?

>Inside a function, the value of this depends on how the function is called ([MDN this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)).

The **ordered** list of rules I use to ascertain what `this` is bound to in a function's execution context are below. 

I consider that `this`:

1. **DEFAULTS** to global or window (or it is undefined if in `strict mode`).
<center>*unless*</center>
1. Is **IMPLICITLY** assigned to the object's instance, if the function is an object's method.
<center>*unless*</center>
1. Is **EXPLICITLY** assigned in case the function has been called with a method like `.bind`, `.call` or `.apply`
<center>*unless*</center>
1. It is bound to a **NEW** object if the execution function is used as a constructor (in this case it is returned implicitly to the caller).

Let's look at them in detail.

# 1. Default
Unelss any of the other cases below applies, in non strict mode `this` refers to the `Window` object in the browser, or to the `global` object in NodeJS. 

```
function prova() {
    this.name = "andrea"; 
};

prova();

console.log(name) // -> andrea
```
In the example above the `name` variable ended up in the global scope's `this`, as the window/global object is boxed and passed into the function whenever no value is explicitly specified to be bound for `this`.

Exception to the rule above is if the script has turned JS into strict mode, specifying the `'use strict'`. In this case, *the value passed as `this` to a function in strict mode is not boxed and not forced into being an object at all, in fact it remains undefined*.

```
"use strict";
function prova() {
    this.name = "andrea"; 
};

prova() // -> Type Error - Cannot set property 'name' of undefined

// Because

'use strict'
function firstTry() {
	return this;
}

firstTry() === undefined; // -> true

// Just to be sure - strict repeated for clarity as repetita juvant
'use strict'
function secondTry() {
	console.log(this);
}

secondTry(); // -> undefined
```

This was introduced in  ECMA 5.1 in 2011, mainly due to security (prevent access to the window object, where confidential info may be stored) and performance issues (boxing and unboxing) [MDN Strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode). Note that using a function as a constructor will change this behaviour, as we will see later.

# 2. Implicit
The binding of `this` is implicitly made to the object's instance for methods.

```
var person = { 
	name : 'Andrea',
	greet: function (){
		console.log("Hello I am " + this.name)
	}
}
person.greet() // -> Hello I am Andrea
```

Keep in mind that this will work with shorthand notation BUT will not worked the same with arrow functions, as the latter bind to the lexical scope they are ran into.

```
// shorthand version
var person = { 
	name : 'Andrea',
	greet() {
		console.log("Hello I am " + this.name)
	}
}
person.greet(); // -> Hello I am Andrea

// Arrow functions DON'T BIND this to the object, hence you will get the binding to the global scope.
var name = 'Enrico';
var person = {
	name : 'Andrea',
	greet : () => { console.log("Hello I am " + this.name);}
} 

person.greet() // -> Hello I am Enrico
```

# 3. Explicitly

The [`.call`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call) and [`.apply`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) methods were introduced very early to the `Function.prototype` (with [JS 1.3 in 1998](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/1.3)), while the [`.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) method was introduced much later (in 2010 with [JS 1.8.5](https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/1.8.5)). 

These three methods provide a manner to bind **explicitly** the `this` keyword to an arbitrary object (or `undefined`, if needed). Note that they don't all work in the same manner, as `.call` and `.apply` execute the function, while `.bind` simply provide the binding without execution, returning an exotic function object (basically, a function which can be then executed);

```
function some (arg) {
	console.log("I am " + this.name + " and I was given " + arg);
}

some.apply({name : "Andrea"}, ["an ice cream"]); // -> I am Andrea and I was given an ice cream

some.bind({name : "Andrea"})(" cookies!!!"); // -> I am Andrea and I was given  cookies!!!
```

Looking back at the implicit binding of `this`, we can see that explicit binding (for example using `.bind`) takes precedence.

```
function greet(){
		console.log("Hello I am " + this.name)
}

// with no .bind
var person1 = { 
	name : 'Antonio',
	greet: greet
}
person1.greet(); // -> Hello I am Antonio

// with .bind
var person = { 
	name : 'Andrea',
	greet: greet.bind({name : 'Enrico'})
}
person.greet(); // -> Hello I am Enrico

```

# 4. New (function constructor)
Every function in Javascript is a [constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) and since [ECMA 6 introduced it](http://www.ecma-international.org/ecma-262/6.0/#sec-new-operator), the `new` operator can be used with all functions. Whent a function is [`newed`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new) the following three things happen in sequence: 

1. An object is created, and bound through the inheritance (prototype, more appropriately!) chain to the `prototype` of the function (which is another object).
1. The function is run, with the `this` reference bound to the newly created object.
1. Unless the function returns explicitly, the object created at point 1 and bound at point 2 is returned to the caller.

So, lifted straight out of MDN's examples:


```
function Person(name, age) {
  // implicitly var this = {};
  // implicitly, as sudo code, this.__proto__ = Person.prototype; 
  this.name = name;
  this.age = age;
  // return this;
}

var me = new Person("andrea", 99);
// Person implicitly returns the `this` that is created. 
me.name; // -> andrea
``` 


## Disclaimer

This post is an adaptation and cherry picking from [MDN site](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) as well as [Kyle Simpson's excellent advanced JS course](https://www.pluralsight.com/courses/advanced-javascript), which I strongly suggest anyone to watch.