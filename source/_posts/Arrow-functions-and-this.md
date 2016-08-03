---
title: Arrow functions (and this)
date: 2016-08-02 18:27:10
tags: 
	- JS
	- ES6
---

In the past month or so I found myself discussing the ES6 Arrow function syntax in a few occasions. In some cases I realised that the understanding was **"arrow functions are just a different, more concise way of writing anonymous functions in JS"**. 

A shorter sintax is part of the reason why arrow functions were introduces, but and this is useful as they may be acutally easier to explain them to a beginner developer. But there are other differences that need to be taken into consideration. To my mind, the main difference is that [**an arrow functions [...] does not bind its own "this"**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions).

This makes them very useful as they dont create a new "this" scope the way a `function` expression does. This means that in callbacks, timeouts and any situation in which an anonynous function expression is nested within a scope, there is no need to do the old fashion "save `this` into a variable to be able to access it from the callback".

{% codeblock lang:javascript %}
function someClass() {
	this.name = "Andrea";
	setTimeout(function () {
		console.log(`Hello ${this.name}`);
	},1000)
}
var p = new someClass(); // will output 'Hello'
{% endcodeblock %}

In order to make the code above work we'd need to get the reference to the scope into a variable (`self` or `vm` in John Papa's angular style guide):

{% codeblock lang:javascript %}
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

{% codeblock lang:javascript %}
function someClass() {
	this.name = "Andrea";
	setTimeout(() => {
		console.log(`Hello ${this.name}`);
	},1000)
}
var p = new someClass(); // will output 'Hello Andrea'
{% endcodeblock %}


