---
layout: post
title: "recursion and stacks"
date: 2014-04-08 22:51
comments: true
categories: 
---
As an intermission in my POODR coding adventure (et all), I am working on data structure. 

The "Concise Notes on Data Structures and Algorithms - Ruby Edition" by Christopher Fox of James Madison University [link][website0] gives a nice and thorough view of data types and algorithms.

For those with a strong stomach, I am even putting together a [GitHub][website1] repo with a few trials on the exercises - updating as I go along.

Anyhow, there are a couple of interesting consideration I wanted to blog about.

####Interfaces, it is always about interfaces
The concise notes do not have the best ruby syntax, far from it. And that is ok, it is a book about Data Structures. For the most part, POODR would have a things or two to say about the coding style.

Regardless this, **the concept of interface is very strong in the explanation of the data types too**. Each data type is progressively introduced, from Containers onwards, by stating the public interface a certain type needs to offer to the outside world to be worthy.

This sounds like an elementary consideration (and maybe indeed it is), but nonetheless it is pretty interesting how this pattern is very consistent with the cornerstone pattern of POODR - which is about messages and interfaces.

This is correlated to the implementation and, most importantly, to the testing.

####Recursions VS Stacks
The concept that a recursion can be solved with a stack and vice versa is one of those truths hidden in the eye of the sun, but the implications for are quite interesting. At the end of it, the computer will have its memory stack with allocated records for each recursion (so, basically, a stack..). 

So why not implementing the problem as a stack in the first place? 

The basic pattern for Stack implementation of a recursion requires:

1. Create a Stack.
2. Push the appropriate value in the Stack.
3. Iteration over the values.
	* Termination condition. 	
	* Pop the value from Stack.
	* Do something with the value
	* Add node to the stack
4. Return the last pop

See also this [Stack Overflow][website2].

So, anyway, my basic implementation of a factorial calculation as a stack rather than recusrsion is as follows (it has been tested so HOPEFULLY it should be fine). Of course, all this is academic, but it still was fun.



	class FactorialsTry
		attr_accessor :num
		def initialize num
			@num = num
		end

		def factorial_recursive
			factorial_rec(@num)
		end

		def factorial_stack
			factorial_stk(@num)
		end

		private

		def factorial_rec number
			if number == 0
				1
			else
				number*factorial_rec(number-1)
			end
		end


		def factorial_stk number
			stack = LinkedStack.new
			stack.push(number)

			(number-1).downto(1) do |num|
				a = stack.pop
				stack.push(a*num)
			end
			stack.pop
		end
	end





[website0]: http://w3.cs.jmu.edu/spragunr/CS240/ConciseNotes.pdf
[website1]: https://github.com/AndreaHK5/DataStructures
[website2]: http://stackoverflow.com/questions/3391285/how-to-convert-a-recursive-function-to-use-a-stack