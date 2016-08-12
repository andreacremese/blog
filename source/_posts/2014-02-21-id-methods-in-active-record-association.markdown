---
layout: post
title: "_id methods in Active Record Association"
date: 2014-02-21 22:37
comments: true
categories: 
---
<p>Reviewing the basics of Ruby by reading Agile Web Development with Rails 4 ( a <a href="http://pragprog.com/book/rails4/agile-web-development-with-rails-4">book</a> I highly recommend) was a good idea. The main reason is that going trough the material again allows me to uncover a different snippet, something new, or brush up on something cool.</p>
<p>This evening's snippet is about helper methods that Active Record Association provides in the model itlsef. This is particular important for the new push for <strong> far models / skinny controllers </strong>.</p>
<p>When writing an instance method in a model, you can call "associated_model_name", and that returns the .associated_model_name if it was applied to the instance.</p>
<p>Meaning that:</p>

<code>
class Cart < ActiveRecord::Base <br>
  &nbsp;has_many :line_items, dependent: :destroy <br>
end <br><br>
class LineItem < ActiveRecord::Base <br>
  &nbsp;belongs_to :cart <br>
  &nbsp;def flim_flam <br>
  &nbsp; a = cart.yadda_yadda_yadda <br>
  &nbsp; # would return the .cart on the particular instance line_item, apply yadda_yadda and put into a. no need for @line_item.cart, as you'd need to do in a console<br>
 &nbsp; end <br>
end <br>
</code>
<p>Small, but cool.</p>