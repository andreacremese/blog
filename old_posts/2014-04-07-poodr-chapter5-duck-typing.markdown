---
layout: post
title: "Poodr chapter5 - duck typing"
date: 2014-04-07 21:50
comments: true
categories: 
---
Chapter 5 of Practical Object Oriented Design in Ruby presents the basic principle of **Duck Typing**. This is one of the ways to implement OOD and keep down the cost of scaling your app.

###The absolute basic
Keep the interface constant and focus on the functionality that you need from the object you are calling. Structure the call in such a way that the message is "get_prepared_for_this", rather than micromanage how this is achieved form the caller class.

In this way, **an object is really defined by its interface, rather then by its data**.

###Duck typing, how not to do it
If what I want from a Duck is to walk_like_a_duck, any object that implements a .walk_like_a_duck is a duck to me. 

So, in slightly more serious words, if I have a common interface the *sender* of the message does not need to know the specifics of the object that am I calling. Let's delve into this by grades.

In an atomic version, say that I want to move my animals. One implementation could be:

	class MyFarm
	 attr_reader :duck, :cow, :dog, :leash, :cowbell
	 [...]
	 	def exodus
			duck.walk_like_duck
			cow.walk_like_cow(cowbell)
			dog.walk_like_dog(leash)
		end
	end
		
		
There are a few aspects of this code that give a clue about **too much intertwining among classes**. There are two main types of dependency in this type of coding:

* MyFarm knows exactly each and every action about the exodus, and know exactly what animals (and beyond) are moving, and how they are moving. Each animal that is added, exodus needs to be updated. 
* MyFarm knows exactly the different interface and arguments in each and every animal. Which means, anything changes in those interfaces, MyFarm has to change.

This looks very similar to sequential coding. Another slightly better version of this implements case switchers.

	class MyFarm
	 attr_reader :duck, :cow, :dog, :leash, :cowbell
	 [...]
	 	def exodus(animals)
			animals.each do |animal|
			case animal
			when Dog
				animal.walk_like_dog(leash)
			when Duck
				animal.walk_like_duck
			when Cow
				animal.walk_like_cow(cowbell)
			end
		end
	end	

This is still overly constrained and intertwined. Any change in rooster, additional animal and whatnot will cause huge disruption. Also note how MyFarm needs to know a lot about the animals.

###Duck typing, reason #1 - a common interface: *same public method*

At the end of the day **every animal (object) is called upon for one reason and one reason only**, to walk. So the idea is for the calling class to use the **same interface**, exactly as every object is here for one reason only.

	class MyFarm
	 attr_reader :duck, :cow, :dog, :leash, :cowbell
	 [...]
	 	def exodus(exilers)
	 		exilers.each {|exiler| 
	 						exiler.walk(arguments)}
	 	end

	end	

Note that, very loosely, the exilers now receive a generic arguments. This intermediate step is not really resolved, it merely serves as a spring board for the next paragraph. Please read on.

###Duck typing, reason #2 - no need to pass arguments across: passing *self*

The second aspect of duck typing, that I personally find a bit underplayed in the book narrative in comparison with its potential (or, to better define, what *I think* its potential is), is the fact that duck typing allows you to **remove the need to pass arguments across**. I personally think this is awesome.

	class MyFarm
	 attr_reader :duck, :cow, :dog, :leash, :cowbell
	 [...]
	 	def exodus(exilers)
	 		exilers.each {|exiler| 
	 						exiler.walk(self)}
	 	end

	end	

By passing *self* to the exiler, the exiler now has access to all items in the caller instance of MyFarm. This provides an additional layer of security for the implementation. So, for example, the tongue in cheek implementation of the dog would be:

	class Dog
		
		def walk(farm)
			leash = farm.leash
			walk_with_leash(leash)
			[...] 
		end
		
		private
		
		def walk_with_leash(leash)
			[...]
		end
	end

Note that farm does not need to pass the leash specifically, but pretty much the whole farm is passed.

###Extending the Dog's behavior example

Say that a new dog is taken on board in the farm, it is a Greyhound. If she is quite like my Greyhound, for half the year she needs a coat to walk outside.

In the very first implementation this would have caused a lot of pain to add: both the sender and the receiver would have needed to be re implemented simply to pass on the coat. Also, I cannot have the Greyhound to walk with a coat in summer, so that if statement would have needed to be in the MyFarm (most likely), intertwining even more the methods.

In the duck type implementation the sender does not change at all (as the interface does not change at all, beside giving an attr_reader to :dog_coat)


	class MyFarm
	 attr_reader :duck, :cow, :dog, :leash, :cowbell, :dog_coat
	 [...]
	 	def exodus(exilers)
	 		exilers.each {|exiler| 
	 						exiler.walk(self)}
	 	end

	end	


And now for the modified Dog class, that would allow the happy Greyhound to reach the end of the exodus without becoming a popsicle.

	class Dog
		
		def walk(farm)
			leash = farm.leash
			walk_with_leash(leash)
			if is_winter?
				coat = farm.dog_coat
				put_on_coat
			end
			[...] 
		end
		
		private
		
		def walk_with_leash(leash)
			[...]
		end
		
		def put_on_coat(coat)
			[...]
		end
	end
	
Note that the only changes are in the Dog class, in order to cater for the new requirement. Also, in an attempt at keeping the public interface as consistent as possible, the put_on_coat is a *private* method that the external world does not need to see.

**At the end of the day, what you need from objects is to walk and participate to the exodus, how they do it is really their own business. An object is hence defined by its behavior - not by its data or content.**

###Polymorphism
This is the characteristic of a message to be able to accept many forms from a receiver. *poly* = many, *morphos* = forms. In the case above, .walk is the interface (or the message) and it has severely different meanings for each receiver. Hence, it is polymorphic.

###A word of caution
Implementing Duck Typing requires some caution, as **objects are defined by their interfaces**, so we presume that each player plays fair. The sender has some blind trust in the receiver. 

It also makes the code a bit less immediate to understand, but much easier to service as we have seen with a very silly example (well, the Greyhound was happy to have the coat on).

###TDD as interface testing - and documentation
An interesting aspect about Testing Driven Development and Duck Typing is the fact that Duck Typing really relies on interfaces. This basically means that 

1. Your testing should focus on public interfaces.
2. Your testing will become in all effects a documentation for the public interfaces.

###Scope for improvement
I have just realized that the next improvement could be not even say .walk to the exilers, but rather .to_exile. A parrot will most definitely fly, not walk (unless is the Norvegian Blue from the Monthy Python)...