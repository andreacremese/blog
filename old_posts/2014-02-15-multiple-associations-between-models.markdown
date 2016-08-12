---
layout: post
title: "multiple associations between models"
date: 2014-02-15 18:53
comments: true
categories: 
---
<p>In the quest to develp my application, and in a larger contest, it turned out I needed to esteablish <strong>multiple connection between the same two models</strong>. As it can be immagined, this woudl cause quite a stir - as computer tend to like univocity.</p>
<p>After a bit of research I found an easy way to do it. And could it be otherwise, it's rails we are talking about!!</p>
<p>Ok, say we have two models, already linked with a <code>has_many :through</code> association, such as:</p>

<code>class User < ActiveRecord::Base <br>
  &nbsp; has_many :instrxps <br>
  &nbsp; has_many :instruments, through: :instrxps <br>
end
</code>
<br><code>
class Instrument < ActiveRecord::Base <br>
  &nbsp; has_many :instrxps <br>
  &nbsp; has_many :users, through: :instrxps <br>
end
</code>
<br><code>
class Instrxp < ActiveRecord::Base <br>
 &nbsp; belongs_to :user <br>
 &nbsp; belongs_to :instrument <br>
end <br>
</code>

<p>And say that you want to establish a new association between Users and Instruments, say called candidates. Candidates will be a separate table, with two foreign keys (user_id and instrument_id). Incidentally, this is the same structure than Instrxp, the already established through table. (Well, not soo much incidentally, this is the whole point of the post…) </p>
<code>class User < ActiveRecord::Base <br>
  &nbsp; has_many :instrxps <br>
  &nbsp; has_many :instruments, through: :instrxps <br>
  &nbsp; has_many :candidates<br>
  &nbsp; has_many :instruments, through: :candidates <br>
end
</code>
<br>
<code>
class Instrument < ActiveRecord::Base <br>
  &nbsp; has_many :instrxps <br>
  &nbsp; has_many :users, through: :instrxps <br>  
  &nbsp; has_many :candidates <br>
  &nbsp; has_many :users, through: :candidates <br>
end
</code>
<br><code>
class Instrxp < ActiveRecord::Base <br>
 &nbsp; belongs_to :user <br>
 &nbsp; belongs_to :instrument <br>
end
</code>
<br><code>
class Candidates < ActiveRecord::Base <br>
 &nbsp; belongs_to :user <br>
 &nbsp; belongs_to :instrument <br>
end <br>
</code>
<p> This will confuse rails. On the side, I have tested this a little bit. It seems that only the Instrxp is loaded (when errors are not trown at you). As we's ay in Italy: nottagodda. <br>In all effects, what we are after is a way to be able to differenciate <strong>@user.instruments</strong> from <strong>@users.candidates</strong>. <br>The :source option in the definition of a new class comes into help. This option allows to specify a "source" module for a relationship with a non-existant fictitious  module, that will be the name of the new relationship. Harder to explain than to see in action. Our modules definition will become:</p>
<code>class User < ActiveRecord::Base <br>
  &nbsp; has_many :instrxps <br>
  &nbsp; has_many :instruments, through: :instrxps <br>
  &nbsp; has_many :candidates<br>
  &nbsp; has_many :candidate_instruments, through: :candidates, :source => :instrument <br>
end
</code>
<br>
<code>
class Instrument < ActiveRecord::Base <br>
  &nbsp; has_many :instrxps <br>
  &nbsp; has_many :users, through: :instrxps <br>
  &nbsp; has_many :candidates <br>
  &nbsp; has_many :candidate_users, through: :candidates, :source => :user<br>
end
</code>
<br>
<code>
class Instrxp < ActiveRecord::Base <br>
 &nbsp; belongs_to :user <br>
 &nbsp; belongs_to :instrument <br>
end
</code>
<br>
<code>
class Candidate < ActiveRecord::Base <br>
 &nbsp; belongs_to :user <br>
 &nbsp; belongs_to :instrument <br>
end
</code>

<p>In this way <code>@user.instruments</code> will return the relationships though Instrxp, while <code>@user.candidate_instruments</code> will return the relarionship though Candidate. Nifty =).</p>