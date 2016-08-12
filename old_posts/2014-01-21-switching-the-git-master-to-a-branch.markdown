---
layout: post
title: "Switching the Git master to a branch"
date: 2014-01-21 21:14
comments: true
categories: 
---
<p>When developing with Git as a version control, it is not uncommon to me to develop on a branch and then wanting to turn that branch into the master without any merging or similar.</p>
<p>After googling and each time finding a different version of doing this, I decided to put together a quick guide on how to do it fast.</p>
<ul>
<li>Make a back up copy of the old branch:<br>
<code>git checkout master</code><br>
<code>git branch oldMaster</code></li>
<li>Delete the old master and create a new one:<br>
  <code>git checkout topicBranch <br>
git branch -D master <br>
git branch master</code>
</li>
<li>Push on github or similar to finalise is a good idea.</li>
</ul>