---
title: Case insensitive search
date: 2014-01-11 19:46
tags:
	- Ruby
	- Rails
---

An update on my previous "search in your Has_many :through" posts. As it turned out, you don't really need to do a "LIKE" search if you are after a record by id (see the syntax of the search query in the previous posts), as the ids are unique. While the spirit of those posts is still very relevant to free searching in database, the code examples are not that relevant if you search by id. Actually, you might not want to use them at all, the main reason being that you need to call a `.first` on the result you will get out of a `.where` (as the result is an array-like element of ActiveRecord).

What you might want to use inttead is a straigh `find_by_id(:id)` method, which is native in rails anyway. This will spit out a single active record result (saving the trouble of calling a .first).

The second (and more juicy) issue is how to search in the database, and a watch-it that took me some time to figure out and kept my (mighty) app down for some time.

As I deployed on Heroku, a search controller started to behave erratically. It displaye behaviour complete unaligned to the localhost trials. The reason behind was that PostGres is case sensisitve in a .where search, while SQLLite is case insensitive. This triggered a cascade of issues in my controller.

Now different searches could be written for development and production environment, but the fastest way to achieve the result was to implement a common search normalizing the results. The easiest trick was to underscore both the database and the searched string. So: `where('name LIKE :query', :query => "%#{query}%")` became `where('lower(name) LIKE :query', :query => "%#{query.downcase}%")`

Worth noting the lower method in the database search, and the .downcase method on the query, in order to normalise both on the database side and on te query side. Thanks to Toby for spending some time this afternoon figuring this out and helping with the first (serious) Heroku deploy.