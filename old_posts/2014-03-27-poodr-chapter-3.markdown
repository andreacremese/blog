---
layout: post
title: "POODR chapter 3"
date: 2014-03-27 10:45
comments: true
categories: 
---
Still a bit jet lagged form the airplane, here are some notes from chpater #3 of Poodr, all about **managing dependencies**.

As we know, messages are at the base of OOD. For an object ot interact with another there three options:

* Knowing the interaction personally (embed it in the method). 
* Inheriting the interaction.
* Knowing an object that knows the interaction.

The third is the one that is discussed in this chapter (and in this post), as it create **dependencies**.
###Dependencies
Dependencies are a necessary evil as they are required in order for the object to interact and send messages, BUT they contstrain the solution and the code. *Dependencies generate coupling*. Some degree is needed, the name of the game is to keep this to the minimum required.

If left unattended, coupling might strangle your capacity to change the code later on. Ultimately, a dependency might prevent (or make it really expensive) to change an object as the ripple effects would be amplified a felt across the stack.

Type of dependencies:

* An object is instantiated **inside** another object.
* The method of another object is called in a `self.method`.
* The instatiation of another object requires some arguments that are not needed for the original object.
* The order of the arguments for the instantiation is important.

###Duck typing

An interesting pre requisite concept for decoupling is **Duck Typing**. There are multiple definitions around, but the basic one is still my favourite:

*When I see a bird that walks like a duck and swims like a duck and quacks like a duck, I call that bird a duck.* (From the [wikipedia page][website])

Note how the definition above concentrates on the message rather than on the attributes of the Duck. It does not need to have feathers, a beek or wings. It needs to give me some messages (walk and wuack). Hence the message-centric concpet for OOD.

My very humble interpretation stems from it, but with a different spin: 

*As long as what I need form a Duck is for it to walk_like_a_duck and quack_like_a_duck - I call "duck" a thing does these actions.*

This is the definition of a duck from the point of view of the object that is "using" the duck (sorry duck). But anyway, **it is the message that is important, not the attribute**.

###Dependency injection
This is a technique that allows decoupling for objects. The aim is to 

1. Isolate objects one another.
2. Rely on messages only for the dependencies.
3. Considering anything that can walk_like_a_duck as a duck, if that is the only thin you need from it.

(Again, sorry duck).

	class SomeObject
		attr_reader :duck
		def initialize duck
			@duck = duck
		end
		...
		def some_method
			().duck.walk_like_a_duck
		end
	end
	
Is the correct implementation. These few lines actually have a lot inside. The mainfeature is that **whatever I pass into the object that has a .walk_like_a_duck method will be a duck.** If i convince a chicken to walk like a duck (sorry both for the mishap, it is for a good cause), for the SomeObject that chicken is a duck. And that is good news for decoupling!!

###When dependency injection is not really possible

In some horror cases, dependency injection is not really possible. This means that some work arounds are needed.

1. Isolate instance creation.
2. Lazily isolate instance creation.

In the first case, the initialization (aka construction) of the other object happens at the initialize. This way it should be easier to refactor, see example below.

	class SomeObject
		attr_reader :duck
		def initialize feathers
			@duck = Duck.new(feathers)
		end
		...
		def some_method
			().duck.walk_like_a_duck
		end
	end

This is good, but still leaves the door open to any potentian issue right off the bat when SomeObject is created. Another option is to call a new duck (sorry old duck) only as needed (lazily), like this:

	class SomeObject
		attr_reader :feathers
		def initialize feathers
			@feathers = feathers
		end
		...
		def some_method
			().duck.walk_like_a_duck
		end
		
		def duck
			@duck ||= Duck.new(feathers)
		end
	end
 
 If duck has already been instantiatied we have it, otherwise we instantiate a new one, but only where and when it is needed. Note that `duck` in the `.walk_like_a_duck` is a message, not an attribute.

###Isolating calls to other classes' methods
Digging deeper into the code, the .walk_like_a_duck is a method that still pertains to a differen object, being this a duck or a very well trained chicken that can fake the duck walk.

A futher level of decoiupling this is to isolate the method and turn this into a `.self` method. So in the example below (repeated for reference and in total violation to the DRY paradigm):

	class SomeObject
		attr_reader :duck
		def initialize duck
			@duck = duck
		end
		...
		def some_method
			().duck.walk_like_a_duck
		end
	end

We can refactor:

	class SomeObject
		attr_reader :duck
		def initialize duck
			@duck = duck
		end
		...
		def some_method
			().walking
		end
		
		def walking 
			duck.walk_like_a_duck
		end
		
	end

The call to the external method is now isolated. Everyone is happy, even the bat-chicken.

### Argument-order dependency
For the constructor method, the order in which arguments are passed in is important. Furthermore, the absence of an argument will inevitably cause your code to fail.

The first option is to remove the single arguments and pass in a single hash with the arguments needed to construct the object.

	cass Duck
		attr_reader :feathers, wings
		def initialize(args)
			@feathers = args[:feathers]
			@wings = args[:wings]
		end
	end
		
	arguments = {
			:feathers => "some feathers",
			:wings => "some wings"
			}
			
	Duck.new(arguments)

This adds verbosity, removes the dependencies on the order, and furnishes an explicit documentation for the code, embedded in the code.

###Default values
This is to tackle the lack of argument of creation (at the end of the day, a duck has 2 wings so far but we want to make sure - OK it is a silly example but I hope you can still follow).

The easiset way is to implement this in the constructor (initialization) method

	cass Duck
		attr_reader :feathers, wings
		def initialize(args)
			@feathers = args[:feathers] || 1000
			@wings = args[:wings] || 2
		end
	end

Now this is OK, beside for booleans. The || method takes whatever is on the left, unless this is *nil* or *false*. If I pass a bool, *nil* is one of the two states I want. Therefore the following statement

	@bool = args[:boolean] || true
  
Seems to suggest to take as a default BUT it will take true in all cases (if I pass nil, it will go to the right hand sides). As we would say in Italy, NottaGudda.

Two patters come to the rescue: 

* Using .fetch method or 
* isolate the default (isolate...surprise-surprise).

The fetch method can be called on the args hash, and try getting the value at the key desired. If not present, it skips to the next value.

	cass Duck
		attr_reader :feathers, wings
		def initialize(args)
			@feathers = args.fetch(:feathers, 1000)
			@wings = args.fetch(:wings, 2)
		end
	end

Another metod that might be interesting is .merge.

	cass Duck
		attr_reader :feathers, wings
		def initialize(args)
			args = defaults.merge(args)
			@feathers = args.[:feathers]
			@wings = args.[:wings]
		end
		
		def defaults
			{:feathers => 1000, :wings => 2}
		end
	end

.merge will put in new values ONLY if where the keys are not present. Spiffy.

### When argument-ordering refactoring is not possible
I will not get into this example in detail, but the idea is to create a *factory* to generate the instance of the object.

* putting the object in a module
* having another module wrapper.
* seconding the construction of the object in a `.self` method in the the wrapper module. This module will accept the hash as input.


###Direction of the dependency

Who is suppsed to include who? A few things to keep in mind:

* How often does a model change?
* Is a model concrete or abstract?
* Changing a model with many dependencies will result in widespread consequences.


###A word of caution
All this is to be taken into prospective. Will it save time in the next build to implement these changes? And in the build afterwards.


[website]:http://en.wikipedia.org/wiki/Duck_typing





