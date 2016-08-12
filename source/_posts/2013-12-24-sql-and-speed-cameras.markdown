---
layout: post
title: "SQL and speed cameras"
date: 2013-12-24 17:33
comments: true
categories: 
---
<p>I had to interrupt the preparation of the Xmas lunch and post the most amousing reason to implement SQL injection protection (see my previous post).</p>
<p>I was chatting with a very good friend of mine about the matter and he sent me this picture.</p>
{% img left /images/sql_injection.jpg 350 350 'image' 'images' %}
<p>As it turned out, someone printed an SQL injection string on the car's front bumper, where the licence plate shoudl be. The reason? Elementary my dear Watson!</p><p>Getting the software that recognises the licence plate to inject the string and drop the db table (and, hopefully, escape the ticket).</p>
<p>Judging from the sintax, he had a fairly precise idea about what needed to be done.</p>
<p>Despicable, but you have to respect the ingenuity of this Polish chap. Thanks Paglia for the amusing tip.</p>