---
title: Bolt On Note, SQL injections
date: 2013-12-24 01:52
tags:
	- Ruby
	- Rails
---

As an addition to my earlier post on the one liner search model method, I started looking at the mechanics of the SQl and where the sanitation actually works. I found out that ActiveRecord::Base provides sanitation, but only in certain cases. 

As it turns out, in the case that an simple string is passed to the .where method the string IS NOT SANITISED. In other words, the following would leave you uncovered:

```ruby
class User < ActiveRecord::Base
	scope :search_by_genere, ->(query) { joins(:instruments).where("instruments.id LIKE '#{query}'")}
end
```


This WOULD NOT BE SANITISED (repetita iuvant).

Instead when an array (or a hash) is passed to the .where method, this is sanitised. For example:
```ruby
class User < ActiveRecord::Base
	scope :search_by_genere, ->(query) { joins(:instruments).where('instruments.id LIKE :query', :query => "#{query}")}
end
```

So as the argument of .where is now a hash rather than a string, the search string is actually sanitised.

More info on this can be found in the [http://api.rubyonrails.org/classes/ActiveRecord/Base.html](ROR documentation<), see the Conditions section.