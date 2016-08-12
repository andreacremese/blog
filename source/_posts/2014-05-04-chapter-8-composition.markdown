---
layout: post
title: "Chapter 8: composition"
date: 2014-05-04 15:28
comments: true
categories: 
---
"Composition is the act of combining together parts into complex wholes".

Unlike inheritance, where behavior and data could be promoted into an abstract class, in composition there is not a specific pattern between the objects, beside that they interact together to make the whole.

Greyhound is a concrete class of the abstract class Dog, but Dog is not a concrete class of the abstract class Farm. So in the second case, the relationship cannot be of inheritance.

At the same time, an Kitchen is an instance of the Room class, but it cannot inherit form House.

##How is this done
####Array style classes
First of all, the "container" of elements is built in an array-style. This might mean including behavior in the class what derives from somewhere else. **Forwardable** is a good way to do it (rather than trying to replicate the code you already have in the Array class).


	class House
		attr_accessible :rooms, :address
		
		def initialize(args={})
			@address	= args[:address]
			@rooms 		= args[:rooms]
		end
	end
	
	require 'forwardable'
	class Rooms
		extend Forwardable
		def_delegators :@rooms, :size, :each
		include Enumerable
		[...]
	end

Forwardable allows to rely on the code that is available, to treat array-like elements as an array.

####Factories
In addition, the idea is to delegate the creation of classes to a Factory. A Factory is a module as it encompasses only behavior and not data. 

The behaviors that are included are:

- To create the array-like container class (.build method below).
- To create the instances inside the array (.create_part method below).

Note that OpenStruct is like struct, with the difference that the initialize accepts hash or arguments, rather than array).


	require 'ostruct'
	module RoomsFactory
		# behavior #1, create the array like container class
		def self.build(config, rooms_class = Rooms)
			rooms_class.new(
				config.collect{|room_config|
					create_room(room_config)})
		end	

		# behavior #2, create the room from the config
		def self.create_room(room_config)
			OpenStruct.new(
				name: 			part_config[0],
				width: 	part_config[1],
				length: 	part_config[3]
				)
		end
	end


####Basic configurations
Note that the basic configurations for the objects are held by arrays of arrays. These are passed to .create_part in order to instantiate a new farm member.

Meaning that the following code is used to create an animal farm:

	NY_flat_config = [['kitchen', '8','8'],
					['bathroom', '4','6'],
					['bed_room', '6','6']]
					
					
	House.new(address: "times square, NYC", 
				rooms: 	RoomsFactory.build(NY_flat_config))

The composition part is the .build. This method will take the array with the standard configuration, will create a room for each element of the array (which is an array itself).

Of course, the point is to have different configurations in order to be able to create elements on the spot via the factory.

	suburb_house_config = [['kitchen', '15','15'],
					['bathroom1', '8','10'],
					['bathroom2', '5','7'],							['living_room', '20','20'],
					[...]	
					['bed_room1, '14','16']]


####Aggregation vs Collection

Aggregation is where the elements are expected to be used as standalone, while collection is used when the elements only make sense if part of the whole.

It would make little sense of use the room alone in the case of a construction and selling of a house (collection), while if the house is for rent it might make more sense for the room to be a standalone element (aggregation).

##Inheritance vs Composition

With inheritance, you get automatic delegation. Also, the code can be much more reasonable, usable and exemplary. Nonetheless, inheritance cannot be used in all cases (in some cases an element cannot really be an *is a...*).  Also, the fallout in case of mistake is much larger.

With composition there is little or no automatic delegation. The tendency is to modularize the problem in many small parts (which is good) with small interfaces (which is good). As a drawback, composition is much harder to pry into from the outside.

**note: all code in this page is pseudo-code. Check out my github for working examples. Or, even better, BUY THE BOOK**