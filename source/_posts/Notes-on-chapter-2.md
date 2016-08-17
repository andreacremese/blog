---
title: POODR - Notes from Chapter 2
date: 2014-03-27 01:14
comments: true
categories: 
	- Rails
	- Ruby
---
Following up on my previous post on POODR's chapter 1 notes, here are some notes for chapter #2.
#### Chapter 2
The King Koncept of the chapter is that of **single responsibility**. In very basic terms, it translates into a push to break down the algorithm to the most basic actions, isolating each one of these actions in a separated method.

The case for this is, mainly, that the code will be more DRY (Don't Repeat Yourself), as these building blocks will be easy to reuse. Also, if you reuse an object you will either reuse the full object or none at all, but never only part of it.

Another way of thinking about the Single Responsibility is to try describe the object's function in the code (or specification) in simple pseudo-code terms. Too articulated descriptions (containing multiple items) are likely to pertain to classes not in Single Responsibility.

An interesting very basic concept is that an object is the sum of whatever you implement + whatever it inherits (somehow). Very basic OOD, but very powerful if you think about it.

On the nitty gritty of coding, there is a strong argument against the use of attribute calls inside the class as instance variables (that means, do not use @ when having to deal with attributes inside the class architecture). Rather, the use of attr_reader, attr_writer and attr_accessor are advocated. One design reason behind this is that in the case something needs to be done with that attribute (say some sort of correction on the value), the attr method can be simply rewritten (ILO changing each and every invocation of the variable).

On a higher level interpretation, using attr_reader rather an instance @ variable in a class method privileges **behavior over data**, message over the attribute (see notes on chapter one, messages are very important).

```ruby
	class Foo
		...
		
		def some_method
			... @bar 
		end
		
	end
```

	
This is not good as it priviledges attributes over message.

	attr_reader :bar

This is the right implementation as it priviledges the action/behaviour.

Another interesting concept, which I believe has to do with experience, is when to make a decision on to split or not to split behaviors (i.e. separate a certain business function in a separate class). In some cases, non optimal solution can survive until the next iteration/scrum, if the cost of splitting is greater than the benefit later on.

One feature that allows to implement very basic classes is the <code>Struct</code>. A Struct type elements is a class which has 1) the initialize and 2)the attr_accessors. It seems the step immediately preceding blessing something with a class by itself.

Side note on Rails: interestingly, one of the interpretations for these design suggestions in this chapter is to figure out the models early in the development (see also my earlier post on the hackaton). The quote "The classes you create will affect how you think about your application forever", seems very telling (even though it applies to something else in this case). Its next interpretation is an advocacy for for fat models - skinny controllers. But maybe I am reading way too much on this.
