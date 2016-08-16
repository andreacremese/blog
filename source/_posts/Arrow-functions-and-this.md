---
title: Arrow functions (and this)
date: 2016-08-02 18:27:10
tags: 
	- JS
	- ES6
---

In the past month or so I found myself discussing the ES6 Arrow function syntax in a few occasions. In some cases I realized that the general understanding was **"arrow functions are just a different, more concise way of writing anonymous functions in JS"**. I have to confess that at the beginning that was as well my impression. Watching [Mark Zamoyta's ES6 training on Pluralsight](https://www.pluralsight.com/courses/rapid-es6-training) gave a great impetous in order to dissect the nuances of arrow functions.

The specs seem to suggest that a shorter syntax is part of the reason why arrow functions were introduced, but they are not a like-for-like substitution for anonymous functions. There are other differences that need to be taken into consideration and, to my mind, the main difference is that [**an arrow functions [...] does not bind its own "this"**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) (from the Mozilla docs).

### Introduction: Lexical scope, Dynamic scope and `this`

As a reminder, **lexical scope** (aka static scope) means that each function has access to its own scope and to the scopes of the calling functions as they are declared. In case the variable / function requested is not present in the current scope, the higher level scope is searched.

```javascript
function doSomething() {
	var a = "Andrea";
	function printIt() {
		console.log(`The name is ${a}`);
		// The lexical (static) scope contains a at the level 'above'. 
	}
	printIt();
}

doSomething(); // Prints The name is Andrea;
```

This is in contrast with **dynamic scope**, where the variable depends on the program state at execution time.

{% codeblock 'dynamic scope' lang:javascript%}
function doSomething() {
	var a = "Andrea";
	printIt();
}

function printIt() {
	console.log(`The name is ${a}`);
}

doSomething(); // Gives a 'Reference error' as 'a' is not in scope. A language like LISP with dynamic scope would be able to access 'a'.;
{% endcodeblock %}


In other words, dynamic scoping would assign variables not according to where functions are written, but rather looking at the call stack. In this case the decision of what the scope containts is a runtime decision, while the lexical scoping decision is a parse time one.

Javascript has lexical scope, functions have their own scope when they run (Note: if functions are new'ed they return that scope automatically). But Javascript provides us well with the `this` mechanism, which instead of doing scope lookups traverses the delegation chain, in a mechanism that is similar to dynamic scope.


### Arrow functions and lexical scope

Arrow functions do not bind to their own lexical scope, but rather they bind to the lexical scope of the function they are invoked into. In other words, they don't create a new scope but rather bind automatically to the scope they are invoked in. This makes them very useful as they don’t create a new 'this' in the scope and bind to that the way a `function` expression does. Also, if`this` is called inside an arrow function, the "higher level's" `this` is actually accessed. 

A good example of this behavior is in callbacks, handlers and any situation in which an anonymous function expression is nested within a function with a scope. With an arrow function there is no need anymore to do the old fashion "save the reference to `this` into a variable to be able to access it from the callback". 


Meaning:

{% codeblock 'nested function creates own lexical scope' lang:javascript%}
function someClass() {
	this.name = "Andrea";
	setTimeout(function () {
		console.log(`Hello ${this.name}`);
	},1000)
}

var p = new someClass(); // will output only 'Hello'
{% endcodeblock %} 

In order to make the code above work we'd need to get the reference to the scope into a variable, usually `self` (or `vm` in John Papa's angular style guide - [Controller-As pattern](https://johnpapa.net/angularjss-controller-as-and-the-vm-variable/)):

{% codeblock 'access higher lexical scope' lang:javascript %}
function someClass() {
	var self = this;
	self.name = "Andrea";
	setTimeout(function () {
		console.log(`Hello ${self.name}`);
	},1000)
}
var p = new someClass(); // will output 'Hello Andrea'
{% endcodeblock %}

This is not needed with arrow functions.

{% codeblock 'arrow function' lang:javascript %}
function someClass() {
	this.name = "Andrea";
	setTimeout(() => {
		console.log(`Hello ${this.name}`);
	},1000)
}
var p = new someClass(); // will output 'Hello Andrea'
{% endcodeblock %}

As a closing thought, because they dont create their own scope, arrow functions canot be **newd** the same way expression functions can.

#### A real life example (from this morning's code review)

While these examples seem academic (in fact they are very similar to Mozilla Doc's examples), below is an example from real life. 

This is an extract from an event handler in a meteor template. The idea is to show a [Semantic UI modal](http://semantic-ui.com/modules/modal.html#/usage) and if the modal is confirmed, delete a certain object in a collection.

{% codeblock 'handler with function expression ' lang:javascript %}
Template.sampleTemplate.events({
   	"click #delete-trip" : function () {
        var _id = this._id;
        $('.delete-modal').modal({
        	// this is the handler for approval on the modal
                onApprove : function () {
                	// this is the action on the collection.
                	// note that the code needs to place the this._id in 
                	// an _id variable, as the handler creates its own lexical scope, 
                	// where this._id is not present. 
                    reports.update({_id : _id}, {$set : {isDeleted : true}});
                    sAlert.info("Report Deleted");
                    return true;
                },
                onHidden : function () {
                    $(".modal").remove();
                    Router.go('reportsDash');
                }
            })
            .modal('show');
	}
	[...]
})
{% endcodeblock %}

In order to run correctly and avoid an `undefined property _id` error, the event handler needs to store the scope (or the part of the scope that will be used later) in a variable in the lexical scope. That is the function of the line `var _id = this._id`. As Arrow functions don't create a lexical scope, this line is not needed if you are using an arrow function.

This seems like a nuance, but having access to the `this` scope from the handler allows to basically forget about storing the _id in a variable and instead write the following:

{% codeblock 'handler with arrow function' lang:javascript %}
Template.sampleTemplate.events({
   	"click #delete-trip" : function () {
        // var _id = this._id; // this is not needed anymore
        $('.delete-modal').modal({
                onApprove : () => {
                    // this._id is now in the handler's scope 
                    reports.update({_id : this._id}, {$set : {isDeleted : true}});
                    sAlert.info("Report Deleted");
                    return true;
                },
                onHidden : function () {
                    $(".modal").remove();
                    Router.go('reportsDash');
                }
            })
            .modal('show');
	}
	[...]
})
{% endcodeblock %}

For the meteor aficionados, the event handler above requires setting up the `allow` on the back end. Meteor methods are a much better pattern, and it is the next refactoring. Have a look at this [Meteor method example](https://github.com/andreacremese/calendarapp/blob/develop/lib/methods/atgEventsMethods.js).   

### Arrow functions and object methods, an important watch-it!

More on the distinction between arrow functions and function expressions, using an arrow function to define an object on a method can cause some unpredictable (bad) results, as the property method cannot be bound to the object's `this`, therefore preventing access to its other properties / methods.

{% codeblock 'arrow function as object method' lang:javascript %}
var object = {
	name : "Enrico",
	talkArrow : () =>  { console.log("with the rocket as anonymous function this' name is " + this.name); },
	talkFunction : function () { console.log("with the function expression this' name is " + this.name); },
}

object.talkArrow() // will fail to access the name in the object's scope
// returns 'with the rocket as anonymous function this' name is undefined'
object.talkFunction() // correctly prints 'with the function expression this' name is Enrico'
{% endcodeblock %}

The new shorthand syntax in order to achieve that with less keypresses is as follows (note, no arrow sign).

{% codeblock 'shorthand as object method' lang:javascript %}
var object = {
	name : "Enrico",
	talkNamedArrow() { console.log("with the named function shorthand this' name is " + this.name); }
}

object.talkNamedArrow() // => prints 'with the function shorthand expression this' name is Enrico'
{% endcodeblock %}

