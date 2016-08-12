---
layout: post
title: "strong params for hashes"
date: 2014-01-02 23:34
comments: true
categories: 
---
<p>Interestingly, it took me a couple of seached to find out about strong params, arrays and hashes. So I decided to put together a small post on the matter.</p> 
<p>As many of you are aware I am sure, the following is a way to use the new feature strong params in Rails 4.0</p>
<code>@safe_params = params.require(:user).permit(:location)</code>
<p>This will weed off anythign that it is passed in params, except under the key "location"" under the key ""user"". The local variable @safe_params will have "location" as a key (so you can access this as @safe_params[:location], easy peasy.</p>
<p>Now I wanted to include safe params for a search with multi parameters, and subsequently for a nested attribute form I put together. So params will require an array, and then an array of hashes.</p>
<p>In order to keep the array through strong params' permit method, the syntax needs to declare that the key will contain an array. That is done by passing in an empty array, as follows:</p>
<code>@safe_params = params.require(:user).permit(:location, :generes_id =>[])</code>
<p>In this case an array of elements (scalar, and I have tried as well strings and it seemed to work) will be permitted. Anything else will be weeded out.</p>
<p>Which means that an array of hashes will be weeded out by the syntax above. In order to allow it through the permit method the syntax needs to include the keys in the array of hashes:</p>
<code>@safe_params = params.require(:user).permit(:location, :generes_id =>[], instrxps: [:instrument_id,:since])</code>
<p>This will allow instrxps to be an array of hashes, each hash with an instrument_id key and a :since key.</p>
<p>-- Addition --</p>
<p>I also remembered (as I stumbled across this the day afterward writing this post) that strong params' method <code>permit</code> is sensitive to the order in which the params to shitelist are passed in. Hashes and arrays go at the end fo the line arguments that are passed to params.</p>
<p>Therefore:</p>
<p><code>@safe_params = params.require(:user).permit(:generes_id =>[], :location)</code> <strong>will gvie an error</strong>, while </p><p><code>@safe_params = params.require(:user).permit(:location, :generes_id =>[])</code> <strong>will work as advertised.</strong> </p>

