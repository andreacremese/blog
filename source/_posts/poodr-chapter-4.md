---
layout: post
title: POODR - Notes from Chapter 4
date: 2014-04-01 19:28
comments: true
tags: 
	- Ruby 
	- Rails  
---
*Some general complaining first:*

Seems like there is no escape for me, I get to blog about POODR by Sandi Metz only when absolutely Dog Tired. Had a red eye flight flight from SF to NY that ended up directly in a very heated meeting yesterday. NJ transit huge delay (45 mins on a 25 mins travel MUST be some sort of record)!


*And now for the interesting stuff instead:*

Anyhow so far we have talked a lot about **messages** between objects and how they are supposed to shape the application. Chapter 4 delves with the interface of classes, and how this is the critical part.

Basically, you want to reuse your code and make sure it is easy to **service and maintain**. To do this you want to minimize the connections among classes. Decoupling is achieved in various manners, e.g. dependency injection.

In chapter 4 the interfaces are dealt with, and what the class actually reveals. Or, in other words, hiding how the kitchen prepares the meal to the customer and showing only the slit where the meal comes from.

#### Public and private interfaces
So, in order to achieve this the **public** interface needs to be reliable, verbose, safe and tested. The public mark should be the hallmark of reliability from the good Rubyist. The **private** interface instead can be nasty.

No, I am kidding, but the public needs to be hidden from others and can change often. At the end of the day, no one depends on that beside the public methods of that class - right?

#### Which object speaks to which one
An interesting representation is the Unified Modeling Language (UML) [link on wikipedia][website1].

Messages are the critical parts for OOD and, following this pattern, you create objects because you have to send messages (not the other way around).

I will not report here Sandi's examples, you guys should buy the book anyway, but will only present the key concepts.
 
A message has a sender and a receiver, and an analysis of the UML pattern will inform if the message sent by an object in need of an information has the correct receiver and if that has the correct pattern. 

A few questions worth asking:


* Is the amount of information required too involved (like procedural coding)? *Or also* is the sender trying to ask the how rather than the what? *Or also* Is the sender micromanaging the receiver? *Or also* **do not embed procedural code in the calling object**.
* How much is the sender supposed to know about the receiver? - Context independence.
* Is the destination object supposed to know all aspects of the required message?
* Is the destination object supposed to manage all the process or do you need an additional object to manage the messaging across different objects?


#### Context independence
This is a further level of insulation between sender and receiver.

```
Sender => message => Receiver.
```

To send the message the Sender will need to know something about the receiver, while most likely this is not really needed.

If I want something entertaining, I might ask a Duck to .walk_like_a_duck. This assumes I know what entertains me in a duck.

Nonetheless what I want is to be entertained, not necessarily to watch .walk_like_a_duck (**what vs how**). So the initial layer would be to ask the duck what s/he could do to entertain me, as this pertains to his/her scope. As she responds, I then act on the response.

```
Sender =what I want to achieve=> Receiver.

Receiver =this is how to do it=> Sender.

Sender =do it=> Receiver
```

At the end of the day it is all about create public methods that require the least possible dependence and knowledge of one another.

#### Public, private and protected

* Public - they are the interface - epic, galactic, not to change. See above.
* Private - you can call only within the class (self. - implicit receiver).
* Protected - as unstable as private BUT it can be called on an instance of the class or subclasses.


#### Law of Demeter
This prohibits to "routing a message to a third object via a second object".

```ruby
kid.mum.oven.start_to_make_cookies
```
This is an example of violation, as oven is 3rd, called via mum (2nd).

Last time I checked there is no Demeter police, but still this will make your dependencies much more stringent as three objects now interact implicitly. Breaking down the call in two lines with an intermediate variable OR a wrapper method would be a good idea.

Keep in mind that it is not necessarily the presence of three dots on a single line that cause a violation of Demeter code. When three objects are, that is a violation.


#### A closing thought

Actually, thinking about it, there should be a standard questionnaire accompanying the UML to evaluate each connection.

[website1]: http://en.wikipedia.org/wiki/Unified_Modeling_Language




