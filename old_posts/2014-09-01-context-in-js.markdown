---
layout: post
title: "Context in JS"
date: 2014-09-01 22:55
comments: true
categories: 
---
I found this rather interesting [video][web0] and this [blog entry][web1] on Context in JS and the **this** keyword. Some reference code below.

####Couple of definitions to warm up

**Execution context**: scope created in the global scope for a function that is called. This is added to the top of the stack and executed. Not the context I am referring to with **this**.

**Context**: the obect that has called a certain function. It is associated with the this keyword and **it depends on where the function has been called**. 

####Now for some chunks


	// Few examples of COntext, assuming we are calling this on the console of a blowser.
		
	// simple function
	function foo() {return this};
	foo();
	// returns --> window	


	// IFFE 
	(function(){return this}());
	// returns --> window	


	// IFFE that uses strict
	(function(){'use strict'; return this}());
	// returns --> undefined	
	

	//IFFE that uses strict BUT takes this as an argument
	(function(self){'use strict'; return self}(this));
	// returns --> window
		

	//in the object context, with literal notation
	var someObject = {
		name: 'andrea', 
		getContext: function(){return this}
		};
	someObject.getContext();
	// returns --> someObject	


	//with the constructor (new) from object type 
	function customObject(name, nickname) {
		this.name = name;
		this.nickname = nickname;
		this.context = this;
	} 
	var someNewObject = new customObject("andrea", "uzo");
	someNewObject.context
	// returns --> someObject instance 
	// also note that in this case it is not a function but a public interface 	
	

	// with binding to specific context
	function otherCustomObject(){
		return this;
	}
	var newObject = otherCustomObject.bind({name: "andrea"});
	otherCustomObject();
	// returns --> {name: "andrea"}	


	// with inheritance.
	var dadElement = {name: "the dad"}
	var child = Object.create(dadElement);
	child.whoAmIInertngFrom = function() {
		return this.name;
	}	
	child.whoAmIInertngFrom();
	// returns --> dadElement





[web0]:https://www.youtube.com/watch?v=yuo8YqKDQ-M
[web1]:http://ryanmorr.com/understanding-scope-and-context-in-javascript/