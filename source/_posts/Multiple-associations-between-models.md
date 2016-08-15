---
title: Multiple associations between models
date: 2014-02-15 18:53
tags: 
  - Rails
  - Ruby
---

In the quest to develp my application, and in a larger contest, it turned out I needed to esteablish *multiple connection between the same two models*. As it can be immagined, this woudl cause quite a stir - as computer tend to like univocity. After a bit of research I found an easy way to do it. And could it be otherwise, it's rails we are talking about!!

Ok, say we have two models, already linked with a `has_many :through ` association, such as:

```ruby
class User < ActiveRecord::Base
  has_many :instrxps
  has_many :instruments, through: :instrxps
end

class Instrument < ActiveRecord::Base
  has_many :instrxps
  has_many :users, through: :instrxps
end

class Instrxp < ActiveRecord::Base
 belongs_to :user
 belongs_to :instrument
end
```


And say that you want to establish a new association between Users and Instruments, say called candidates. Candidates will be a separate table, with two foreign keys (user_id and instrument_id). Incidentally, this is the same structure than Instrxp, the already established through table. (Well, not soo much incidentally, this is the whole point of the post…)

```ruby
class User < ActiveRecord::Base
  has_many :instrxps
  has_many :instruments, through: :instrxps
  has_many :candidate
  has_many :instruments, through: :candidates
end

class Instrument < ActiveRecord::Base
  has_many :instrxps
  has_many :users, through: :instrxps  
  has_many :candidates
  has_many :users, through: :candidates
end

class Instrxp < ActiveRecord::Base
  belongs_to :user
  belongs_to :instrument
end

class Candidates < ActiveRecord::Base
  belongs_to :user
  belongs_to :instrument
end
```

This will confuse rails. On the side, I have tested this a little bit. It seems that only the Instrxp is loaded (when errors are not trown at you). As we's ay in Italy: nottagodda. <br>In all effects, what we are after is a way to be able to differenciate *@user.instruments* from *@users.candidates*. <br>The :source option in the definition of a new class comes into help. This option allows to specify a "source" module for a relationship with a non-existant fictitious  module, that will be the name of the new relationship. Harder to explain than to see in action. Our modules definition will become:

```ruby
class User < ActiveRecord::Base
  has_many :instrxps
  has_many :instruments, through: :instrxps
  has_many :candidate
  has_many :candidate_instruments, through: :candidates, :source => :instrument
end

class Instrument < ActiveRecord::Base
  has_many :instrxps
  has_many :users, through: :instrxps
  has_many :candidates
  has_many :candidate_users, through: :candidates, :source => :use
end

class Instrxp < ActiveRecord::Base
  belongs_to :user
  belongs_to :instrument
end

class Candidate < ActiveRecord::Base
  belongs_to :user
  belongs_to :instrument
end
```


In this way `@user.instruments` will return the relationships though Instrxp, while `@user.candidate_instruments` will return the relarionship though Candidate. Nifty =).