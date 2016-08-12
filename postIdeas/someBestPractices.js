// The idea is not to use anonymout function, and always have named expression functions instead



### function declaration are hoisted function expressions are not.
note that function declarations are those that start with function. in an iife there is a function expression.
The compiler pulls out the declaration first.


### don`t anonymous functions expressions
// this is a named function expression
// you can refer to the funciton from within (the this will not cut it)
// you end up having reference to the name of the function
// it is also self documenting, 
var bar = function someExpressiveName() {
	throw new Error("Now you know when it throws!");
}

var foo = function () {
	throw new Error("This will throw in anonymous function =(");
}

setTimeout(function () {
	throw new Error("This will throw in anonymous function =(");
}, 400);


setTimeout(function someExpressiveName() {
	throw new Error("Now you know when it throws!");
}, 400);

bar();

// Error: Now you know when it throws!
//     at someExpressiveName (repl:2:7)

foo();

// Error: This will throw in anonymous function =(
//     at foo (repl:2:7)

// this works as well with IIFE
(function someNewNameHere() {
	throw new Error("Now you know when it throws!");
})();



### 'use strict'
Shoudl always use strict as in that way it is much harder to pollute the global scope with undeclared ccrap

### eval (evil)
eval allows you to inject js code and evaluate. This allows you to cheat on the lexical scope of JS, making for some very interesting code. 
Also, the compiler will have no idea what will come, so most of the optimization is turned off, for a much slower performance. 


### with
This is as well another possibility to screw up with the global scope and iject there some nasty varialbe

var obj = {
	a: 2;
	b: 3
}


with (obj) {
	a = b + 1:
	d = 3;
}
// this will make it create a d in the global scope

obj.d // undefined
d; // 3 ?????? wut?


### use IIFE pattern!
Immediately Invoking Function Expression;
As scope is created with functions, in order to isolate scope we d need a function.
The whole idea is NOT TO LEAVE ENYTHING BEHIND, not even the name of the function.
Remember that you can pass in parameters to the IFFEs

// donkey balls style
(function smartName(b){
	var foo = b;
	console.log()
})(a);

// note the different parenthesis.
(function smartName(b){
	var foo = b;
	console.log()
}(a));


### use let in the for loop

Use the let block scoping in order to follow the principle of least disclosure.
In that way the scope is not polluted with a var called i 

for (let i = 0; i < 2; i++) {
	console.log(i);
}

for (j = 0; i < 2; i++) {
	console.log(i);
}

i // Reference Error
j // is 2
// at this point i is not in scope anylonger, while with 

Garbage collection, stylistical stuff, better =)
console.log(i);


#### This!!! (this shoudl be a post in itself)
every function, while executing, has a reference to its current execution context. that is called `this`
there are 4 rules. So the `this` keyword gets bound to a certain context.

Find the call site: place in code where a function is executed.
4 rules apply to the call site and apply these rules to understand `this`:

- The new keyword in front of a function creates a `this`. Any function will turn into a constructor.
The constructor binds the `this` to a new object. 
	When this happens:
	1 a new empty object is created
	2 the object gets linked to another object
	3 the new object gets bound to the `this`
	4 if the function does not return, there is an implicit return `this`
- EXPLICIT you are using .call or .apply and passing in an obj. A HARD BIND .bind does the same.
- IMPLICIT obj.functionHere() (functions are not copied around, but rather reference is made to a function) the context object / becomes the keyword.
	obj.funct(), in funct the this is bound to the obj 
- DEFAULT in strict mode of the code running the function, the default is undefined, in non strict it is the global scope.




### don`t use setINterval, rather go for setTimeout and recursively call it
This is because setINterval calls the passed in function no matter what. This means that, if the passed in function is a long running one, the operations may overlap.
On the other hand setTimeout does not execure unless the caller is done. This is much better as you have sequential execution, rather than executions piling up.s




### the conditional check should be fist 
on https://app.pluralsight.com/player?course=javascript-design-patterns&author=aaron-powell&name=javascript-design-patterns-m0-common&clip=5
if (val == undefined) { return price; }

I think it is harder to understand otherwise (see the example)