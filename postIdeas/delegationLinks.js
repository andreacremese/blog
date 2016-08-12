
"use strict";
// from https://davidwalsh.name/javascript-objects-deconstruction
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
// https://devchat.tv/js-jabber/220-jsj-teaching-javascript-with-kyle-simpson

// so much to unpack here!
// Mixins / Ploymorphism
// Duck typing
// prototype and __proto__ (together with the Pluralsight course) They are both object instances
// and that is the whole point, there is not a compiled class with virtual methods and whatnot, it is only a link to an object

// function can be newed, it creates a context (this) and runs the constructor
//

function Foo(who) {
    this.me = who;
}

Foo.prototype.identify = function() {
    return "I am " + this.me;
};

function Bar(who) {
    Foo.call(this,who);
}

// this creates as instance of the object without running the actual function
// it also linkes the prototype to Foo, whish means that the .constructor for the prototype is actuallly lineked to Foo (and not bar.)
// because .constructor is an arbitrary property.
Bar.prototype = Object.create(Foo.prototype);

Bar.prototype.speak = function() {
    console.log("Hello, " + this.identify() + ".");
};

var b1 = new Bar("b1");
var b2 = new Bar("b2");

b1.speak(); // alerts: "Hello, I am b1."
b2.speak(); // alerts: "Hello, I am b2."

b2.constructor === Bar; // false?!?!?!
b2.constructor === Foo; // true?!?!?!?!

// This is because the only case when an object gets a constructor is when a function is actually ran, as in Foo.call(this, who). When using new OR when using Object.create 
// the object does not get the constructor

Bar.prototype.constructor = Bar


b2.constructor === Bar // this is now true, as expected.

// this because the meaning of constructor is 
// So we have to change how we think of what the .constructor property means. 
// It does not mean "the constructor this object was created by". It actually means 
// "the constructor which creates any objects that end up getting [[Prototype]] linked to this object." 
// Subtle but super important difference to get straight.

// OR

// as the specs explain: Returns a reference to the Object function that created the instance's prototype.
// OR Object.prototype.constructor => Specifies the function that creates an object's prototype.
// The Object.prototype property represents the Object prototype object.


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//The alternative

// no functions, rather we get objects only
var Foo1 = {
    init: function(who) {
        this.me = who;
    },
    identify: function() {
        return "I am " + this.me;
    }
};
// no new keywork, no weird inheritance. 
// we just get the prototype connected here
var Bar1 = Object.create(Foo1);

Bar1.speak = function() {
    alert("Hello, " + this.identify() + ".");
};

// and here as well, no more __proto__ .prototype, .constructor and whatnot
// the delegation chain becomes much easier.
var b1 = Object.create(Bar1);
b1.init("b1");
var b2 = Object.create(Bar1);
b2.init("b2");

b1.speak(); // alerts: "Hello, I am b1."
b2.speak(); // alerts: "Hello, I am b2."


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Classes, this and super

// Question about the super interesting JS Jabber episode 220 with Kyle Simpson
// https://devchat.tv/js-jabber/220-jsj-teaching-javascript-with-kyle-simpson

/**
Disclaimer: with this gist I am NOT trying to diss Kyle or simlar. I am trying to 
understand the point Kyle made in JS Jabber 220 regarding classes and super in JS ES6. 
I am a fan of Kyle, watched a few of his excellent Pluralsight courses, was 
really inspired by his JS Jabber interview and spent quite some time on his 
blogpost about `inheritance` (note the quotes) at https://davidwalsh.name/javascript-objects-distractions.
**/


/** extract from the  episode (reported here for convenience)
https://devchat.tv/js-jabber/220-jsj-teaching-javascript-with-kyle-simpson

Well, that’s all well and good except for the fact that the performance of creating a relative 
polymorphic reference called super is really terrible. And the JavaScript engine developers on 
TC39 said, “We’re not going to implement super if it has to be dynamically calculated. It’s got 
to be statically calculated because the performance is going to be really bad otherwise.” So, they said, 
“Well, okay. Here’s what we’ll do. We will say that the super keyword gets determined or calculated at 
the time that the object is declared,” in other words when I declare class A and then I say B extends from A, 
that’s when we’ll determine what the super keyword points to. And we will statically fix it and you will not 
be able to change it. That will make the JavaScript engine developers happy because they know that they can 
statically calculate it once instead of dynamically recalculating it.

Okay, great. Except for the fact that a whole bunch of people [in] JavaScript for 21 years now have been 
used to being able to take objects and dynamically rebind the this context and use methods in other object 
contexts. That is, there’s a lot if rich history in JavaScript of doing that. And that’s actually something 
I’m very much a fan of, is being able to take a method and borrow it for other object contexts. The this 
keyword is dynamically calculated. So, if you have a method on A and you try to use it against C for example it 
will dynamically switch to the C context. That’s great. Except the super keyword is not dynamically calculated. 
So now, if you have a method that uses both the this keyword and the super keyword, you will be surprised when you 
find out that the this keyword nicely switched its dynamic context while the super keyword stayed statically fixed 
to the time that it was calculated at declaration time.
**/

// After this comment, and due to the fact that I have not used classes massively in JS, I wanted to find an example to 
// where a call to super would not be dynamicaly calculated.

// parent class
class First {
	constructor(me) {
		this.me = me;
	}
	speak() {
		return "I am " + this.capitalise();
	}
	capitalise() {
		return this.me.toUpperCase();
	}
}

// child class
class Second extends First {
	constructor(me){
		super(me);
	}
	speak () {
		return("Speak in Second returns (" + super.speak() + ")");
	}
}
// create an object
var b1 = new Second("cAt");
b1.speak()
// > Speak in Second returns (I am CAT)'
// OK, all good so far

// now we `borrow` the speak method to another object
// and rebind the .capitalise to lowercase, rather than uppercase
var borrowerObject = {
	me : "the boRRoweR",
	capitalise : function borrowedCapitalised () {
		return this.me.toLowerCase();
	}
}
borrowerObject.speak = b1.speak.bind(borrowerObject);
borrowerObject.speak() 
// 'Speak in Second returns (I am the borrower)'
// the this is recalculated to use the lowercase `capitalise` method.
// so far so good.


// Now we try to amend the speak method on First, called by Second (super.speak)
// and bound to the borrowerObject. I change the tense of the response from present to past.
First.prototype.speak = function borrowedSpeak() {
	return "I was "+ this.capitalise() ;
}
// If super is not recalculated, the original `present tense` speak should be called
borrowerObject.speak() 
// >'Speak in Second returns (I was the borrower)'
// the speak is in past tense. This suggests that the method speak on the First prototype is dynamically calculated for the borrower object?


// Can you please help shed some light?



