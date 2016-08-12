---
layout: post
title: "Association, Aggregation and Composition (and chapter 8 of the POODR)"
date: 2014-05-17 10:34
comments: true
categories: 
---
While I await the publication of the standard repository of all the knowledge and wisdom in the universe, the "Hitchhikers guide to the Galaxy", and its much awaited chapter on OOD, my quest for OOD knowledge continues.

One concept that seemed worth expanding is Association, Aggregation and Composition. We touched upon this during [Chapter 8 of Poodr][website1], but it is time for a deeper charge at the matter.

This is conceptually relevant for Ruby developers, but it becomes semantically relevant for other 

###Association
A relationship between two classes is, generically, an **association**. Small interfaces and TDD public interfaces is the key to keep an OOD architecture scalable. Easy to say, hard to do but that's where the fun is =).

###Aggregation
**Aggregation** is a relationship between two classes in which one of the classes has a class invariant that includes the existence and the relationship with a concrete instance of the other class.

As a note, class invariant is one of the five assertions according to the [Concise Notes on Data Structures and Algorithms Ruby Edition, Christopher Fox, James Madison University, 2011][website2].

*A class invariant is an assertion that must be true of any class instance before and after calls of its exported operations.*)

In a Book instance, Ink and Paper are in a relationship. Each instance of Ink has a class invariant that requires it to be related to an instance of Paper. Paper does not have such constraint, as it can live by itself.

Actually, Paper is associated with Book, but I *could* rip it off and make it a standalone element. (Also note, I am very good with my inkwell - no ink anywhere else than on paper!)

This is, obviously, a **constraint** for coding - it needs to be taken into consideration for scalability (refer again to POODR).

###Composition
**Composition** is a relationship between two classes in which both classes have a class invariant that includes the existence and the relationship with a concrete instance of the other class.

In a House instance, a Door instance and a Handle instance require one another (we are considering only a finished house, no saloon or double swing doors). For the fans of Calculus I, this is an "if-and-only-if" condition.

This is an even bigger **constraint** to keep small interface between classes instances.

###A closing note
Consider looking concepts like [dependency injection][website3], [Duck Typing][website4] and [Poodr][website5] in general to allow scalability and pleasure of development.

[website1]:http://andreahk5.github.io/blog/2014/05/04/chapter-8-composition/
[website2]:http://w3.cs.jmu.edu/spragunr/CS240/ConciseNotes.pdf
[website3]:http://andreahk5.github.io/blog/2014/03/27/poodr-chapter-3/
[website4]:http://andreahk5.github.io/blog/2014/04/07/poodr-chapter5-duck-typing/
[website5]:http://www.poodr.com/