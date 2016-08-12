---
layout: post
title: "bootstrap, html forms and form_for"
date: 2013-12-27 17:30
comments: true
categories: 
---
<p>After dithering for a bit I finally accepted than my first app needed to look pretty. That meant one thing and one thing only: it was Bootstrap time. So I grabbed a panettone slice, some coffe and put myself to it.</p>
<p>Along the many things I discovered in the first day of learning bootstrap, an easy but interesting tip that I can give is to be very careful with the html form tags that bootstrap would like you to use. This as an incorrect placement in the cascading might affect severely your routing.</p>
<p>The main reason is that, if you wrap a Rails' form_tag with an html Bootstrap form tag to style it nice, the html form tag will prevail and your routing will suffer quite dramatically (i.e. it will not work at all).</p>
<p>In other words, the standard solution that is given in the bootstap page (for example for a navbar):</p>
<code> &lt;form class="navbar-form navbar-left" role="search"&gt;</code><br>
<code> &nbsp;<%= form_tag search_path, method: :get do %></code> <br>
<code> &nbsp;&nbsp; ...happy input_tags go in here...</code><br>
<code> &nbsp;<% end %></code><br>
<code> &lt;/form&gt;</code><br>
<p><strong>Will not work as expected in Rails</strong>, as the html form will overtide the form_tag. Meaning: you will not direct to the search_path but remain to the page you are in. As I was in "home" while developing this, this was twice as dangerous as it was not even giving me an error but showing some begus outcomes.</p>
<p>A simple fix is to change the bootstrap tag from "form" to a simple "div", also as we don't really need any logic part from html. Are we using rails for a reason or not?!?. So <strong>this will work as advertised</strong>:</p>
<code> &lt;div class="navbar-form navbar-left" role="search"&gt;</code><br>
<code> &nbsp;<%= form_tag search_path, method: :get do %></code> <br>
<code> &nbsp;&nbsp; ...happy input_tags go in here...</code><br>
<code> &nbsp;<% end %></code><br>
<code> &lt;/div&gt;</code><br>
<p>Another possibility woul be to merge the two and actually use the full potential of Rails and Bootstrap the way it is intended. <strong>So this woudl work as advertised</strong> (with even less keystrokes):</p>
<code> <%= form_tag search_path, method: :get, class: "navbar-form navbar-left" do %></code> <br>
<code> &nbsp;&nbsp; ...happy input_tags go in here...</code><br>
<code> <% end %></code><br>