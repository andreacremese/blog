---
layout: post
title: "Poodr - chapter 6 - Inheritance (whys and hows)"
date: 2014-04-12 11:39
comments: true
categories: 
---
In the big picture the why remains always the same for [poodr][website1] book: reduce the marginal cost of adding a functionality to a ruby application.

Here are some notes on Chapter 6 - Inheritance.
####The Basics

Inheritance, at its core, is an **automatic message delegation** system. As seen in previous chapter, the core of OOD relies on messages and how these are exchanged between classes.

Inheritance comes handy when one class develops and needs to have different behaviors. At first it seems tempting to swell the one class (or data type) with multiple behaviors. 

This will most likely violate the **single responsibility** requirement (see chapter2). You'll have classes with a gazilion of if statements or, even worse, case .. where to decide what behavir to invoke. 

In order to avoid this, the idea is use inheritance. Conceptually, the mechanics of the process are to **promote** the generic behavior to the **abstract** class (the parent, or superclass), and to leave the **specialized** behavior in the **concrete** classes. 

One watch it: if inheritance is implemented with only one "child" class, it is very likely done wrong!

####Automatic messaging delegation

When using inheritance, if a message (method) is not present in the concrete (child) class, the call is automatically pushed up to the super class. 

On the other hand  if the method is present in the child class the parent class method is not considered at all.

This can be overrided and the beaviors mixed by calling <code>super</code> in the concrete class. This allows to retrieve the behavior from the superclass.

	class Abstract

		def some_method
			[...]
		end

		def some_other_method
			[...]
		end
	end

	class Concrete < Abstract

		def some_method
			[...]
			# the method in the Abstract class is NOT invoked
		end

		def some_other_method
			[...]
			super
			# the method in the Abstract class IS invoked
		end
	end


Note that a <code>super</code> call is an admission that the concrete class knows behaviors of the abstract class. In other word, **calling super is a coupling**. And coupling is bad as it might hinder the capability of the code to be scaled up.

####Promoting Behavior...
The idea is to put all the behavior that is common (abstract) in the super class, letting the concrete classes to specialize.

####...in initialization (Hook message)
This is implemented right off the bat in the <code>initialize</code> method. In order to minimize the .super calls, the technique for the .new are to rely on explicit messages passed between the superclass and the child.

* Let the superclass have the initialize method.
* At the end of the initialize call a post_initialize method (hook message), that contains the specialized behavior for the concrete class.
* The post_initialize method needs to be present in the superclass - but in this case it just spits out nil.

This is also called **hook message**. 


	class Abstract
	
		def initialize(args)
			[...]

			post_initialize(args)
		end

		def post_initialize(args)
			nil
		end
	end

	class Concrete1 < Abstract

		def post_initialize(args)
			@specialized_variable1 	= args[:specialized_variable1]
		end

		[...]
	end

	class Concrete2 < Abstract

		def post_initialize(args)
			@specialized_variable2 	= args[:specialized_variable2]
		end

		[...]
	end
	
####...in defaults for initialization (Template Method)

Defaults for variables are best to be messages (surprise surprise) and to be implemented in the specialized class - see example below. 

A default value is to be given for the abstract class as well if possible. In some cases this is not possible or would not make sense.

The fact that the specialized class needs to implement a default value should not be left hanging. This is where a <code>raise</code> comes handy.

	class Abstract

		def initialize(args)
			@variable1 		= args[:variable1] || variable1
			@varialve2		= args[:variable2] || variable2
		end

		def variable1
			"value1 - abstract value"
		end
		
		#In the case variable2 cannot be set to a sensible value in the abstraction
		#and needs to be in the specialized class, an error would allow easier debugging later on.
		  
		def variable2
			raise NotImplementedError,
			"This #{self.class} cannot respond to: #{__method__}"
		end

		end

		class Concrete1 < Abstract

			def variable1
				"value1 - specialized value 1"
			end

			[...]

		end

		class Concrete2 < Abstract
				
			def variable1
				"value1 - specialized value 1"
			end

			[...]
			
		end

####...for behavioral methods 

In order to decouple as much as possible, the idea is to implement all of the behavior present in the child classes, and delegate down to them the behavior via a local message.

In a way, this seems to suggest that the superclass should have the public methods that are expected to call by an external source (if this is within the shared abstract behavior), with the specialized methods feeding up the messages to the public methods.
			
		class Animal

			[...]

			public

			def speak
				# some abstract behavior might be here ...
				local_speak
			end

			private

			def local_speak
				"the #{self.class} has not implemented #{__method__}"
				# Note that this might require a different behavior, 
				# depending on what the method is supposed to do.
			end

		end

		class Dog < Animal

			private

			def local_speak
				"Bark Bark"
			end

			[...]

		end

		class Cat < Animal

			private
				
			def local_speak
				"Meeew"
			end

			[...]
			
		end
			

####Conclusion
Some of my take aways:

* Promote/specialize behavior.
* Abstract => Superclass, Concrete behavior => child class.
* Use Hook Method and Template Methods for initialization and defaulting. 
* Pass messages between superclass and child.




[website1]: http://www.poodr.com/