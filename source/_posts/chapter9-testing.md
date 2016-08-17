---

title: POODR - Notes from Chapter 9 - testing
date: 2014-05-08 20:04
comments: true
tags: 
	- Ruby
	- Rails
---
The importance of testing cannot be underestimated. As a personal note, I can't believe that during my time coding in Fortran we did not implement TDD but rather testing was done manually (well, we also had physical validation to ensure the data was correct).

**Why testing?**

* Testing, if written first, is your specification. For someone like me coming form the construction industry, this is pretty cool.
* Find bugs and mishaps very early in the play, ideally before they can propagate.
* Gives documentation for free (free is good).
* Defer design decision and allow refactoring.
* Support abstractions.
* Expose dependencies (how much context do you need to set up to test a particular feature?).

**What to test?**

Following the encapsulation of private method, the public interface is *usually* what needs to be tested. Of course, there are exceptions.

**How to test**

*BDD - Behavior Driven Design: Working from the boundaries of the app inside
*TDD - Test Driven Design: Working from the core out.

BDD requires much more mocking and, as a result, seems more prone to issues in terms of mocks not being aligned with the actual class and model.

A few functions are to be tested:

* Incoming messages.
* Outgoing messages.
* Duck Typing.
* Inheritance structures.

### Incoming Interfaces
These are the public methods of the class, tested making assertions about the expected response. A good example is attr_accessor.

	class Dog
		attr_accessor :name
		
		def initialize (args={})
			@leash = args[:leash]
		end
		[...]
		
		def ready_to_go_out?
			[...]
			unless leash.has_bags?
			 return false
			end
			[...]
		end
	end
	
	class DogTest < MiniTest::Unit::TestCase
	
		def setup
			@dog = Dog.new(leash: Leash.new)
			# here's the dependency injection!!
		end
		
		def test_responds_to_name
			assert_respond_to(@dog, :name)
		end
	end


In the case dependency is injected (as before to make sure the leash has bags inside), this needs to be made evident in the test. Note that this is required as tests double up as well as documentation.

Now the issue is that you might have different types of leash (leather, normal, long). To test Dog you can't use an actual one, you need a double.
	
	#say that we have so many leashes types, all in different classes
	# they will all be ducks, but we need the behavior to test the dog.
	class LeashDouble
		[...]
		
		def has_bags?
			true
		end
	end


	class DogTest < MiniTest::Unit::TestCase
	
		def setup
			@dog = Dog.new(leash: LeashDouble.new)
			# here's the dependency injection!!
		end
		
		def test_responds_to_name
			assert_respond_to(@dog, :name)
		end
		
		def test_we_can_go_out
			assert_equal @dog.go_out? true
		end
	end

Note that BDD requires extensive mocking, as in many cases the outer types will require some mock behavior from the more core classes.

To be more precise, what you need from a Double is the behavior, not the leash itself. Now the risk is that the implementation of the object (the leash) might be updated, while the mock is not. This because the mock is, in a way, a sort of duplication (is it a violation of the DRY principle? who knows at this point). This will of course break your app badly.

The easy way out of this is to implement a Duck Type testing, more on this later (the basic idea is to put the relevant testing in a module and include that module in the Double as well).

### Outgoing Messages
Outgoing messages are Queries or Commands, and in most cases they are not tested. If they need to be tested, a particular pattern for the test is required.

	[...]
	
	def setup 
		@observer = MiniTest::Mock.new
		@gear 		= Gear.new(
								chainring: 	52,
								cog: 		11,
								observer: 	@observer)
	end
	
	def test_notifies_observers_when_cogs_changes
		@observer.expect(:changed,true, [52,27])
		@gear.set_cog(27)
		@observer.verify
	end
	[...]
	
	
Regarding the test:

- First line sets the check.
- Second line triggers the action.
- Third line actually does the testing.

### Duck typing

When you have many objects that can pose as a duck, you cannot implement the same test in all of them by control-c and control-v. That is a blatant violation of DRY.

As a test is, basically, a behavior - the idea is to lump the testing in a module (container of behavior) and then include this in the different modules.

	module WalkerInterfaceTest
		def test_that_it_walks_like_a_duck
			assert_respond_to(@object, :walk_like_duck)
		end
	end
	
	class DuckTesting < MiniTest::Unit::TestCase
		include WalkerInterfaceTest
		
		def setup
			@object = Duck.new
		end
	end
	
	class ChickenTesting < Minitest::Unit::TestCase
		include WalkerInterfaceTest
		
		def setup
			@object = Chicken.new
		end
	end	
	
By including the module of the testing behavior, the testing will get run.


### Testing inheritance

Inheritance actually presents many folds in terms of testing:

* Testing the interfaces abstract/concrete - done with a module that must be included in both the abstract class test and in the concrete class test.
* Testing concrete specific roles - done with a module to be included only by the concrete class.
* Testing unique behavior concrete class - included directly in the class method.
* Testing unique behavior abstract superclass - in some cases you need to include the behavior of a Subclass in the Superclass test. In these cases the pattern may be similar to the Doubles pattern above, with the same caveat (include to the doubles the same testing for the actual classes).
		







