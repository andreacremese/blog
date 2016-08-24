---
title: Tfs or git?
date: 2016-08-16 14:24:59
tags:
	- Source Control
	- Best Practices
---

There is a large amount of blog posts on the subject `TFS vs GIT`. I have experience using both, the former usually crops up when dealing with large legacy code bases of long running projects. The latter is the default choice for open source projects (in GitHub) and as well for proprietary projects (GitHub private repos, Visual Studio Online).


Regardless the amount of documentation already present on the subject, organizational change pivots on communication (as my Change Management professor kept going on repeating). With this post I'd like to aggregate in a bite size form the pros and cons of TFS vs GIT.

# Definitions

Visual studio online puts it best in their [introduction](https://www.visualstudio.com/en-us/docs/tfvc/comparison-git-tfvc):

{% blockquote %}
	Git is a distributed version control system. Each developer has a copy of the source repository on their dev machine. Developers can commit each set of changes on their dev machine and perform version control operations such as history and compare without a network connection. Branches are lightweight. When you need to switch contexts, you can create a private local branch. You can quickly switch from one branch to another to pivot among different variations of your codebase. Later, you can merge, publish, or dispose of the branch.

    //...

	Team Foundation Version Control (TFVC) is a centralized version control system. Typically, team members have only one version of each file on their dev machines. Historical data is maintained only on the server. Branches are path-based and created on the server.

{% endblockquote %}

Interesting note, MS rebranded TFS to TFVC, as Team Foundation contains a superset of functionalities. In this post I hope I will be excused to keep using the old slag and refer to the version control as TFS.

# Git

The key advantages in using git to me are:

* Git keeps the project footprint much smaller, as for TFVC each branch is an entire new copy of the full repo on your machine.

* Following the previous point, git is much faster. It does not take minutes to create or download a branch, it usually takes seconds.

* Pull request with code review (or at least on line code commenting) is the best way to work Agile. Each user story has its branch, and gets merged when it gets to the end of the swim lanes. Devs can work easily on multiple User Stories if they get blocked, and it is easier to keep code separated before it reaches production. PRs are also a great way to level the field among the development team, disseminate knowledge, ensure better quality (short of full pair programming, which doubles the development cost). Tfs does not support pull request natively.

* For some reason the perception from the outside is that `git == GitHub`, and therefore `all your code ends up being public`. There are multiple ways to keep your code secure and private, from GitHub itself to MS Visual Studio Online [which supports git](https://www.visualstudio.com/en-us/docs/git/share-your-code-in-git-vs).

* Git from command line is great, but Win users don't have bash unless they are on Anniversary Win 10. Nonetheless, [Source Tree](https://www.sourcetreeapp.com/) is a great free (!) tool that gives a visual representation of the status of the branches, both local and on remotes. Plus it supports the tried and tested [git flow](http://nvie.com/posts/a-successful-git-branching-model/) working method.

* With Git you get less merge conflicts as it does three way merging out of the box (meaning, it takes into consideration the original version of the file as well, on top of the two points of merging). TFS version control normally runs on two way merging ([from this source](http://www.continuousimprover.com/2015/06/why-you-should-abandon-tfs-source.html)).

* Microsoft itself is telling us, in so many words, to use Git. 

	- 'Git is the default version control provider for new projects. You should use Git for version control in your projects unless you have a specific need for centralized version control features in TFVC.' [MS - Choosing the right version control for your project, Visual Studio August 2016](https://www.visualstudio.com/en-us/docs/tfvc/comparison-git-tfvc).

	- Micrososft even gives the tutorial on how to novate from TFS to Git [Visual Studio, May 2016](https://www.visualstudio.com/en-us/articles/mapping-my-tfvc-actions-to-git).

	- The TFS team has been focused on git support: `Lately, all our new development work has been in Git features.` - [Brian Harry, PM at MS TFS, on his blog in April 2014](https://blogs.msdn.microsoft.com/bharry/2014/04/14/is-microsoft-abandoning-tfvc-in-favor-of-git/).

* Other big players like **Perforce**, the standard for version control in game developing, are integrating git (via [git fusion](https://www.perforce.com/support/tutorial-video-library/video/git-fusion-overview) for example).



# TFS (aka TFVC)

The key advantages of using TFS to me are:

* Lower friction with teams that are trained and used to TFS. Retooling the team for git is a cost.

* Can address almost every need that Git addresses, just takes longer / it is more painful. 


<br>

I am aware that git provides additional advantages to those outlined above, but I wanted to keep this post short and to the point. Also, I wrote this in the time I had to wait for TFS to re-download 4 GB worth of repository from scratch, due to some corrupt .cs files.

Agree? Disagree? Please comment below!