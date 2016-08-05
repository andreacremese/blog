---
layout: post
title: "Chapter 7 of Poodr - Modules (and Inheritance: extended edition)"
date: 2014-04-22 23:33
comments: true
categories: 
---
Chapter 7 of [Poodr][website1] builds on top of the previous material on inheritance in [chapter 6][chapter5page]. This mainly as module and mix-ins has a very similar relationship with inheritance.

**Modules are another method for automatic delegation** (see also inheritance). Unlike inheritance, modules are used to share behavior between classes that do not have a common abstract type for behavior promotion.

###Sharing behavior (duck typing)
Imagine that you have a number of classes that share a behavior, but they cannot be all specialization of an abstract class. In this case we will **abstract the behavior by itself, rather than abstracting a class**.  

The idea is to group the methods required in common in a module, and include this module in all classes required.

Use a verbose name for the module is also recommended, as this will be a container of behavior.

	class Listened
		def listened_lately?(listenable, time_frame)
			puts "the #{listenable.class} has been listened in the last #{time_frame}"
			false
		end
	end
	
	module Listenable
		attr_writer :listened
		
		def listened
			@listened ||= ::Listened.new
			# this is the injection
		end
		
		def listened_lately?
			listened.listened_lately(self,time_frame)
		end
		
		# this is the template method, include might override
		def time_frame
			"7 days"
		end
		
		
	end
	
	class Audiobook
		include Listenable
		
		# This is the specialized method
		def time_frame
			"30 days""
		end
		
	end
	
	class Podcast
		include Listenable
		
		# This is the specialized method
		def time_frame
			"5 days""
		end
		
	end
	
	p = Podcast.new
	p.listened_lately?
	
	
In this quick example:

* Audiobook and Podcast cannot be placed in an inheritance arrangement.
* The same pattern for **template method** introduced in inheritances is used for modules.
* All classes implement the module.
* If module sends a message, it must provide the template implementation (even if this is just an error).

###Looking methods up the food chain

When a method is called on a class, or an instance of a class, this is searched up the inheritance tree and the module tree. As soon as it is found, the search is interrupted (and that is why we use template methods).

See below a brief explanation about the method research:

* First, the method is searched locally.
* Then it is searched in the Singleton class (methods defined for that instance only).
* After, it is searched in the modules included, starting form the last "included" (bottom in the class).
* Then, the superclass is invoked and searched.

When multiple inheritances and modules are included, tracing this might become very complicated. Hence, the idea is to keep the inheritance pyramid as narrow as possible.

###Abstraction is all or nothing
When implementing abstractions in modules (or superclasses) all of the *include* or of the subclasses must implement all of the abstraction. Pick and mix can create some serious issues.

And, at the end of the day, what would be the point of having modules if you then cherry pick the behavior.

###Liskov substitution
Each subclass must be a suitable substitution for the superclass.

This means that taking q(x), being q a property and x and element of T, q(y) must be verified for y being and element of S, and S being a subtype of T.

Note that the opposite is not required, meaning this is a one way street (specialization might add behavior).



 




[website1]: http://www.poodr.com/
[chapter5page]: http://andreahk5.github.io/blog/2014/04/12/poodr-chapter-6-inheritance-whys-and-hows/