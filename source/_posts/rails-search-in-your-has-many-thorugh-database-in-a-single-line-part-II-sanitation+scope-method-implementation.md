---
title: Rails – Search in Your Has_many :thorugh Database in a Single Line Part II (Attack of the ActiveRecord::Relation AKA string sanitation)
date: 2013-12-23 12:39
tags: 
	- Rails
	- Ruby
---

Building on the previous post *Rails – Search in Your Has_many :thorugh Database in a Single Line*, let's look at:
  
  - How to integrate the one_liner_searching_bonanza into the model. 
  - String sanitation.
  - Keeping the one_liner_coding experience.

Part 1) is fairly easy, as well as part 2), but we will tweak the syntax later to keep the "one liner spirit" to achieve 3). Afterall, as an achieved programmer, your attention span cannot be longer than one line anyway. As a note, all the coding that I'll present here is for the model side of your app.


So the class method for part 1 might look something like this:

```ruby
def self.search_by_genere(query)
	joins(:instruments).where('instruments.id' => genere)
end
```

This would left the door open to any ill intentioned hacker in the road, so now for the string sanitation - part 2, we'll polish up the query:
```ruby
def self.search_by_genere(query)
	joins(:instruments).where('instruments.id LIKE :query', :query  => "#{query}")
end
```
Now for part 3, rolling all in a single line. Active Records Query Interface provides scope methods, which are a compact syntax to call a class method when interacting with the databases (so for methods like joins, where, find and simlar). This allows to pass in the required method(s) as a block, with a syntax that look like:
```ruby
class User < ActiveRecord::Base
	... 
	scope :search_by_genere, ->(query) { joins(:instruments).where('instruments.id LIKE :query', :query => "#{query}")}
end
```

So we now have all rolled up in a single line.