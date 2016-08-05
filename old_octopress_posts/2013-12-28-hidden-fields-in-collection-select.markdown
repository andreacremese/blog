---
layout: post
title: "hidden fields in collection_select"
date: 2013-12-28 13:39
comments: true
categories: 
---
<p>I thought about sharing the "solution" for an issue that I encoutnered while attempting to implement a drop down in my app today.</p>
<p>After implementing a collection_select to replace the check_box_tag I originally included for a search (note, for a search, not to create new objects), I noticed that the relative action controller behaved very erraticaly. By including a binding.pry (an interruption in the code that allows you to check the "current" status of the code - highly recommended) I discovered that an empty string ("") was included in the :params spitted out by the collection_select. This was being catched by one of the private methods and not digested well by my controller.</p>
<p>I thought about simply deleting the empty string when evaluating the params with the .require and .allow methods for STRONG params. That proved complicated in logic terms, as I still wanted a catch all in case someone wanted to do an empty search and include all results. Also did not seemed like a professional fix. On top of that the dog needed to be wlaked and I did not have too much time for very complicated logic games.</p>
<p> So I set out to do what engineers seems to do best: <strong>understand why what they have done does not behave the way they intented (disclaimer: it works like that for all engineers, in all field - I am a chartered engineer afterall).</strong></p>
<p>So it turns out one of the gotcha for the collection_select is that it includes a hidden field right above it that passes an empty string to the params. This as usually the checkbox is in a form_for to create or update an element in the db (see more info at this <a href="https://github.com/justinfrench/formtastic/issues/749">link</a>. If the user does not checks anything the params would not be created for that variable. An empty string would not raise an error in cases of .create or .update (I guess).</p>
<p>In my case I did not need the empty string as I am dumping the search right afer presenting the results. So I implemented the <code>:hidden_fields => false</code> option.</p>
<p>All worked smoothly, dog was walked and everyone was happy chappy. If you have a pro railscast subscritpion it is super worth checking out for <a href="http://railscasts.com/episodes/258-token-fields-revised">this Ryan Bates episode </a>.</p>