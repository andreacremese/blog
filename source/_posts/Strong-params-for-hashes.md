---
title: Strong params for hashes
date: 2014-01-02 23:34
tags:
	- Ruby
	- Rails
---

Interestingly, it took me a couple of seached to find out about strong params, arrays and hashes. So I decided to put together a small post on the matter.  As many of you are aware I am sure, the following is a way to use the new feature strong params in Rails 4.0

```ruby 
@safe_params = params.require(:user).permit(:location)
```

This will weed off anythign that it is passed in params, except under the key "location"" under the key ""user"". The local variable @safe_params will have "location" as a key (so you can access this as @safe_params[:location], easy peasy.

Now I wanted to include safe params for a search with multi parameters, and subsequently for a nested attribute form I put together. So params will require an array, and then an array of hashes.

In order to keep the array through strong params' permit method, the syntax needs to declare that the key will contain an array. That is done by passing in an empty array, as follows:

```ruby 
@safe_params = params.require(:user).permit(:location, :generes_id =>[])
```

In this case an array of elements (scalar, and I have tried as well strings and it seemed to work) will be permitted. Anything else will be weeded out.

Which means that an array of hashes will be weeded out by the syntax above. In order to allow it through the permit method the syntax needs to include the keys in the array of hashes:

```ruby 
@safe_params = params.require(:user).permit(:location, :generes_id =>[], instrxps: [:instrument_id,:since])
```

This will allow instrxps to be an array of hashes, each hash with an instrument_id key and a :since key.

-- Addition --

I also remembered (as I stumbled across this the day afterward writing this post) that strong params' method `permit` is sensitive to the order in which the params to shitelist are passed in. Hashes and arrays go at the end fo the line arguments that are passed to params.

Therefore: `@safe_params = params.require(:user).permit(:generes_id =>[], :location)` **will give an error**, while 
`@safe_params = params.require(:user).permit(:location, :generes_id =>[])` *will work as advertised*. 

