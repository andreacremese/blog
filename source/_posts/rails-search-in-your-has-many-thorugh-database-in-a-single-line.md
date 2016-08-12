---
title: Rails – search in your has_many :thorugh database in a single line
date: 2013-12-21 11:55
tags:
	- Ruby
	- Rails
---

Searching in the database of a rails application can be quite a maze for a newby. Associations create an additional hurdle, and a has_many :through can be quite a tricky one.

I stumbled across this issue while coding my first app. I considered for a bit to search the assocaited model  and relate it to the parent model. Or trying to do something wth the through table. 

I rapidly realised that this woudl have taken some considerable code space, brain power and, most importantly, it would have been extremely error prone (read: heavy debugging, lots of coffee, unhappy dog for lack of proper walking time, and so on).

 There must be a better way and, as it turns out, there is. Hopefully in this post I can give a pointer for it.

 The basic issue is that the tables are separated in the databases. This means that the parent table (say, Users) does not have a column for the associated table (say, Instruments). And the vice versa is true as well in a has_may :through, due to the fact that for the has_many :through there is a third table that contains aaaaaaaaall the relationships between the two models.

That means that brave (or kamikaze, or insane, or silly) developers could actually search in the joint table (good luck!) and then relate what he finds back the two models (even more good luck, and a very unhappy dog again)

Shrewd developers instead seem to use an SQL command that allows to combine the two tables, rolle them into a single meal and search for what it is needed in one go. This command is JOIN and, luckly, there is a rails method that allows you to call that. 
This Rails method is .joins (**NOT** joints, even though I am sure an alias can be writted for our more liberal mates interested in a trip to Amsterdam).

 So, keeping the same example as before:
```ruby
class User < ActiveRecord::Base 
	has_many :iuassociations
	has_many :instruments, through: :iuassociations
end
```

```ruby 
class Instrument < ActiveRecord::Base</br> has_many :iuassociations</br>
  has_many :users, through: :iuassociations</br>
end
```

```ruby
class Iuassociation < ActiveRecord::Base
  belongs_to :user
  belongs_to :instrument
end
```


**There is no single method that would allow us to search in the User db table through the instruments **such as `User.where("instruments.ids are some number")`. 

What we can do as a stepping stone to this is to create a "combined" table  where we can search Users by their Instruments. Note, I prefer not to call this table ""a join table"", as it woudl be confusing with the has_many_and_belongs_to_many JoinTable. Am sure someone more knowlegeable than me will object.

 The syntax `User.joins(:instrumets)` generates this table for us. In this table (presented as an array, if you look at that in the console), you can run a normal .where and search the parent model (Users) through the associated model (Instruments).


So, for example, `User.joins(:instrumets).where('instrument.id' => 1)`
will return the users that are associated with the instrument id = 1.

 Note that the parent-associated is arbitrary, a has_many :through would work both ways. So you can search instruments though the users with similar sysntax.

…or we can write a gazilion lines of code to search in the through table, if you fancy (Dog is moaning again).


Next time we'll look at how hiding this in the model and prevent it from going out of date. Thanks a lot to Steven Nunez for actually developing this with me.
