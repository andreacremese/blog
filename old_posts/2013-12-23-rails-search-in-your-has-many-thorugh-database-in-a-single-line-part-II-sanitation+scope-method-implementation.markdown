---
layout: post
title: "Rails – Search in Your Has_many :thorugh Database in a Single Line Part II
<br>(Attack of the ActiveRecord::Relation AKA string sanitation)
date: 2013-12-23 12:39
comments: true
categories: 
---
<p>Building on the previous post "Rails – Search in Your Has_many :thorugh Database in a Single Line", let's look at:</p>
<ul style="text-indent: 1em">
  <p>1) How to integrate the one_liner_searching_bonanza into the model. </p>
  <p>2) String sanitation.</p>
  <p>3) Keeping the one_liner_coding experience.</p>
</ul>
<p>Part 1) is fairly easy, as well as part 2), but we will tweak the syntax later to keep the "one liner spirit" to achieve 3). Afterall, as an achieved programmer, your attention span cannot be longer than one line anyway. As a note, all the coding that I'll present here is for the model side of your app.</p>
<p>So the class method for part 1 might look something like this:</p>
<code>def self.search_by_genere(query)</code><br>
<code>&nbsp; joins(:instruments).where('instruments.id' => genere)</code><br>
<code>end</code>
<p>This would left the door open to any ill intentioned hacker in the road, so now for the string sanitation - part 2, we'll polish up the query:</p>
<code>def self.search_by_genere(query)</code><br>
<code>&nbsp; joins(:instruments).where('instruments.id LIKE :query', :query  => "#{query}")</code><br>
<code>end</code>
<p>Now for part 3, rolling all in a single line. Active Records Query Interface provides scope methods, which are a compact syntax to call a class method when interacting with the databases (so for methods like joins, where, find and simlar). This allows to pass in the required method(s) as a block, with a syntax that look like:</p>
<code>class User < ActiveRecord::Base</code><br>
<code>&nbsp; ... </code><br>
<code>&nbsp; scope :search_by_genere, ->(query) { joins(:instruments).where('instruments.id LIKE :query', :query => "#{query}")}</code><br>
<code>end</code>
<p>So we now have all rolled up in a single line.</p>
<p>Thanks to Steven Nunez for actually unveiling this to me.</p>
