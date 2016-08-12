---
layout: post
title: "Rails – search in your has_many :thorugh database in a single line"
date: 2013-12-21 11:55
comments: true
categories: 
---
<p>Searching in the database of a rails application can be quite a maze for a newby. Associations create an additional hurdle, and a has_many :through can be quite a tricky one.</p>
<p>I stumbled across this issue while coding my first app. I considered for a bit to search the assocaited model  and relate it to the parent model. Or trying to do something wth the through table.</p> 
<p>I rapidly realised that this woudl have taken some considerable code space, brain power and, most importantly, it would have been extremely error prone (read: heavy debugging, lots of coffee, unhappy dog for lack of proper walking time, and so on).</p>
<p> There must be a better way and, as it turns out, there is. Hopefully in this post I can give a pointer for it.</p>
<p> The basic issue is that the tables are separated in the databases. This means that the parent table (say, Users) does not have a column for the associated table (say, Instruments). And the vice versa is true as well in a has_may :through, due to the fact that for the has_many :through there is a third table that contains aaaaaaaaall the relationships between the two models.</p>
<p>That means that brave (or kamikaze, or insane, or silly) developers could actually search in the joint table (good luck!) and then relate what he finds back the two models (even more good luck, and a very unhappy dog again)</p>
<p>Shrewd developers instead seem to use an SQL command that allows to combine the two tables, rolle them into a single meal and search for what it is needed in one go. This command is JOIN and, luckly, there is a rails method that allows you to call that.</p> <p>This Rails method is .joins (<strong>NOT</strong> joints, even though I am sure an alias can be writted for our more liberal mates interested in a trip to Amsterdam).</p>
<p> So, keeping the same example as before:</p>
<code> class User < ActiveRecord::Base</br> has_many :iuassociations</br>
  has_many :instruments, through: :iuassociations</br>
end</code>
</br>
</br>
<code> class Instrument < ActiveRecord::Base</br> has_many :iuassociations</br>
  has_many :users, through: :iuassociations</br>
end</code>


<code>class Iuassociation < ActiveRecord::Base</br>
  belongs_to :user</br>
  belongs_to :instrument</br>
end
</code>

<p><strong>There is no single method that would allow us to search in the User db table through the instruments </strong>such as <code>User.where("instruments.ids are some number")</code>. </p>
<p>What we can do as a stepping stone to this is to create a "combined" table  where we can search Users by their Instruments. Note, I prefer not to call this table ""a join table"", as it woudl be confusing with the has_many_and_belongs_to_many JoinTable. Am sure someone more knowlegeable than me will object.</p>
<p> The syntax <code>User.joins(:instrumets)</code> generates this table for us. In this table (presented as an array, if you look at that in the console), you can run a normal .where and search the parent model (Users) through the associated model (Instruments).</p>

<p>So, for example, <code>User.joins(:instrumets).where('instrument.id' => 1)</code>
will return the users that are associated with the instrument id = 1.
<p> Note that the parent-associated is arbitrary, a has_many :through would work both ways. So you can search instruments though the users with similar sysntax.</p>
<p>…or we can write a gazilion lines of code to search in the through table, if you fancy (Dog is moaning again).</p>
</br>
</br>
<p>Next time we'll look at how hiding this in the model and prevent it from going out of date. Thanks a lot to Steven Nunez for actually developing this with me (or, in other words, for allowing me to be shotgun while we researchied this).</p>
