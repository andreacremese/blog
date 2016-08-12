---
layout: post
title: "symbols (and why they are important)"
date: 2014-02-13 23:57
comments: true
categories: 
---
<p>I came across symbols farily soon after the first experiments in Ruby and Rails. Nonetheless I have to confess it was never crystal clear what they were. So I decided to dig the ground a bit.</p>
<p>Symbols are:</p>
<ul>
<li>Strings.</li>
<li>Immutable strings that can be only overwritten (meaning all the bang (!) methods, shovels (<<) and similar do not work on them).</li>
<li>Immutable strings that have a certain and defined place in memory.</li>
<li>Due to this, they are much faster to retrieve (hence why they are used massively in rails).</li>
<li>They also tend to be much faster to compare for equality, as you can grab the ID and compare it, rather than to deconstruct the whole string.</li>
<li>You can actually freeze a string and make it behave like a symbol on the surface. Nonetheless it still will not fully behave like a symbol under the hood.</li>
</ul>
<p>The post at this <a href="http://www.robertsosinski.com/2009/01/11/the-difference-between-ruby-symbols-and-strings/">link</a> by Robert Sosinski is probably the best and most interesting  explanation on the matter that I could find shopping around.</p>