---
layout: post
title: "git etiquette"
date: 2014-06-21 12:21
comments: true
categories: 
---
As I have started to collaborate with a larger group of developers in a scrum team it sounded like a good idea to bring everyone up to speed with how to collaborate - hopefully succesfully - in git and github.

There seems to be several ways to colllaborate on github: forking and pull requesting (more suitable for open source projects) and using git flow.


##Collaborate using git flow
This is a more codified manner to interact, possibly more suitable for an office - team setting. The best way to use it is probably with sourcetree (atlassian) or installing git flow for line command.

This post explains pretty well the ins and outs:

https://github.com/nvie/gitflow/wiki/Command-Line-Arguments

##Collaborate using forking and pull request

####Basic setup
Fork the repository in your github AND have the origin remote to push to YOUR github - not on the company github. 

In order to do this you'll need to fork the company private repository in your personal github account. Note that private repos are still private when forked.

After doing this you can set up the remotes. Suggested names are: 

* “Origin” remote to point to your gitHub repo. 
* “Upstream” remote to point to company GitHub.


		git remote add origin https://github.com/YourGitHubAcconunt/project_name.git

		git remote add upstream https://github.com/CompanyGitHub/project_name (fetch)		

You can check this by:

		git remote -v

		origin	https://github.com/YourGitHubAcconunt/project_name.git (fetch)
		origin	https://github.com/YourGitHubAcconunt/project_name.git (push)
		upstream	https://github.com/CompanyGitHub/coconut (fetch)
		upstream	https://github.com/CompanyGitHub/coconut (push)

####Working on a feature/userstory
When adding a feature ALWAYS work on a feature branch and then go for merge with master.

	git checkout -b some-new-feature-branch

No works, features or fixes directly on master branch please!

####Working on a feature that someone else is working on
In this case, pull down the code form the other dev from his github. More on pulling and fetching later.

	git remote add TeamMate https://github.com/TeamMate/project_name.git
	git checkout some-new-feature-branch
	git pull TeamMate  some-new-feature-branch 

####When done with the feature
When done with the fix, push up to YOUR REPOSITORY, NOT TO THE COMPANY ONE.

	git add .
	git commit -m ‘new feature up and running’
	git push origin some-new-feature-branch

Then go to GitHub and make a pull request. DO NOT PUSH TO UPSTREAM (company account) and as well DO NOT GO STRAIGHT to the company github and accept+merge to master OR branch.  

####Accepting and Merging
Do not accept and/or merge the pull request on the company github master without warning/consulting other devs - especially QA.

After merging on the company:master, make sure to warn all other developers!

For the merging, either review the changes on line on github OR pull them down locally for testing before accepting.

####Checkout locally the pull request (rather than on line).

In order to do the merging in a local env:

* Create local branch of the contributor's pull request, and check it out locally.

		git checkout -b NameOfContributor-BranchName BranchName(or master)

* Pull down the code in the branch you just created.

		git pull https://github.com/NameOdContributor/project_name.git BranchName


At this point you can test the code locally before merging it. If the test is succesful, merge the changes and update the company github.

* Check out the branch you want to merge into.


		git checkout BranchName(or master)

* Merge the branch you have just tested.

		git merge --no-ff NameOfContributor-BranchName
		
* Push this upstream.


		git push upstream BranchName(or master)


**Note:** The pre populated code to do this can be found on the pull request page on github, but pay attention to the remotes (the **"origin"" in the github hint will not be the origin in your local env**).

####After a feature is accepted and merged upstream (to the company repo)

If you were not the dev accepting and merging, or if you have done it on the web github, you will need to pull down the code locally, making sure you are in the master. Also, good practice is to delete the feature branch.

	git checkout master
	git pull upstream master
	git branch -d some-new-feature-branch

Now, you can start on a new feature branch/userstory. 

The same applies when some one else's feature is finished and merged in the master.

####Git Fetch vs Git Pull
As a clarification:

	git pull = git fetch + git merge


Git fetch is safe to do also as it updates the branches you are not working on, but you are just watching + it will not change your working copy.


####References
http://gitimmersion.com/

http://nathanhoad.net/git-workflow-forks-remotes-and-pull-requests

http://stackoverflow.com/questions/292357/difference-between-git-pull-and-git-fetch

http://stackoverflow.com/questions/7987687/what-is-the-difference-between-git-branch-and-git-checkout-b

http://stackoverflow.com/questions/9069061/what-is-the-difference-between-git-merge-and-git-merge-no-ff
