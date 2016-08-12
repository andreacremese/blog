---
layout: post
title: "Bolt On Note: SQL injections"
date: 2013-12-24 01:52
comments: true
categories: 
---
<p>As an addition to my earlier post on the one liner search model method, I started looking at the mechanics of the SQl and where the sanitation actually works. I found out that ActiveRecord::Base provides sanitation, but only in certain cases.</p> 
<p>As it turns out, in the case that an simple string is passed to the .where method the string IS NOT SANITISED. In other words, the following would leave you uncovered:</p>
<code>class User < ActiveRecord::Base</code><br>
<code>&nbsp; ... </code><br>
<code>&nbsp; scope :search_by_genere, ->(query) { joins(:instruments).where("instruments.id LIKE '#{query}'")}</code><br>
<code>end</code>
<p>This WOULD NOT BE SANITISED (repetita iuvant).</p>
<p>Instead when an array (or a hash) is passed to the .where method, this is sanitised. For example:</p>
<code>class User < ActiveRecord::Base</code><br>
<code>&nbsp; ... </code><br>
<code>&nbsp; scope :search_by_genere, ->(query) { joins(:instruments).where('instruments.id LIKE :query', :query => "#{query}")}</code><br>
<code>end</code>
<p>So as the argument of .where is now a hash rather than a string, the search string is actually sanitised.</p>
<p>More info on this can be found in the <a href="http://api.rubyonrails.org/classes/ActiveRecord/Base.html">ROR documentation</a>, see the Conditions section. Thanks to Toby M. for the input to sit down and research this.</p>