---
layout: post
title: "POODR - notes from Chapter 1"
date: 2014-03-26 21:29
comments: true
categories: 
---
<p>As it turns out, Practical Object Oriented Design in Ruby (aka POODR - for friends) is a MUST READ for developers, neck beards and nerds like me (don't have a beard yet, and am getting into developing. I tick the NERD box though).</p>
<p>So, while waiting for my flight to SF to leave the tarmac, I unwrapped my POODR copy, took out my orange mechanical pencil and spread my merchandise on the three seats United gave me this evening. Here are some notes from the first chapter of POODR.</p>
<p>One note: of course my ramblings are for my own personal pleasure and notes. They are for and from someone that already develops in Ruby and Rails (and used to suffer through sessions of FORTRAN).</p>

####Chapter 1

<p>The case for good Object Oriented [OO for friends] is clearly spelled out and substantiated. In extreme summary:</p>
<p>The client cannot know what he wants until he sees it (and then he will want some changes anyway) => BUFD (Big Up Front Design) is impossible => Agile is needed => Tiny incremental code => design that allows expansion will make you save time (= money) later.</p>
<p>This does not mean try to design for the future, but rather design <strong>code that is manageable and expandable no matter the direction the design will go later</strong>. It is more catering for the future, rather than try to design the future in.</p>
<p>So, it should be clear, that design is key. Not really the BUFD (dangerous) but rather the "lower level" design. The ultimate yard stick, after all this, is "how long would it take to add one extra feature to the code?"</p>
<p>One of the key concepts that is repeated in the first chapter is <strong>messages</strong>. In OOD, objects interact one another, and the way they do this is by exchanging messages. Objects need to know about one aonther, but they need to be well encapsulated so they remain modularized. For this, messaging among the objects instances need to be appropriate.</p>
<p>In Ruby (and in every OO language) <strong>everything is an object</strong>. Meaning, there is not a <code>String</code> data type, that has some functions defined into. There is a <strong>String class</strong> (object) that has inside the methods that are provided with the string as and when this is initialized.</p>
<p> <strong>class = Attributes + Methods</strong>, or also object = Data + Fuctions.</p>
<p>Really enjoyed this first chapter, waiting for the pretzel cart to come by and then delving straight away into the second chapter.</p>