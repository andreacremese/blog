---
title: "Connecting remotely to a Visual Studio solution running in a VM (say Parallels)"
date: 2015-03-22 23:40
comments: true
tags: 
	- Visual Studio
	- Win10

---
*This article discusses my attempts (and eventual success) to connect remotely to a solution running in the Visual Studio Debugger in a Parallels VM.*

#####Connecting to a Visual Studio localhost

To me, it is much nicer to develop an angular (or a node project in OSX or Linux). But if your backend project is in, say, .NET, it is a pain to debug in local. When working on extensive - mid-large scale projects - this is seldom the situation.

#####The standard solution: IIS
Yes, I know, you can run everything in Parallels (or have a win machine in the first place) and yes, of course, you can run the .NET solution in an IIS site and yes, by all means, you can add that site to your host files so you can connect to it from your OSX environment (say that you run Parallels or any other VM). 

**BUT** all this adds another (unwanted) piece to the puzzle: IIS.

Meaning that, if you want to debug your code in an end-to-end scenario, you have to attach your code (in VS) to the correspondent process running in IIS. Fun (not really).

Also, after a bit of doing this, I realized some idiosyncrasies of IIS, especially in not picking up a change in the compiled DLLs and EXEs after a build. More Fun.

This is all due to the fact that Visual Studio runs a solution in IIS Express, and it does not allow to connect to that solution remotely. I guess this is a security feature, but we are responsible people (aren't we?!?!).

#####Doing away with IIS

So I tried a few things to get around this. I even tried some port forwarding (yes I wanted this *that* badly). I finally set on a solution.

Here's the work around:

* In Win: open the firewalls (inbound and outbound) of the port you are connecting to.
* Give yourself permission to bound to network adaptors other than localhost. So in an elevated prompt you can run:

		netsh http add urlacl url=http://*:2067/ user="NT AUTHORITY\INTERACTIVE"  

* Change the binding for the site you are running in the applicationhost.config file (%USERPROFILE%\Documents\IISExpress\config\applicationhost.config):

		<site name="..." id="...">
		<-- more setting shere -->
			<binding protocol="http" bindingInformation="*:2067:*" />

* In Mac, go to your hosts file in /private\etc, and add the VM's ip address to the hosts (if not known, ipconfing in win will help):

		192.168.1.113   winhost


Et volia, in mac you shoudl not be able to navigate to http://winhost:2067, running in VS on a virtual machine in Parallels.

Here for some references:

[Serving external traffic with WebMatrix Beta](http://blogs.iis.net/vaidyg/archive/2010/07/29/serving-external-traffic-with-webmatrix-beta.aspx)

[Remotely accessing the Windows Azure Compute Emulator](http://fabriccontroller.net/blog/posts/remotely-accessing-the-windows-azure-compute-emulator/)

[Stack Overflow : Android Emulator loopback to IIS Express does not work, but does work with Cassini](http://stackoverflow.com/questions/6192726/android-emulator-loopback-to-iis-express-does-not-work-but-does-work-with-cassi/18958879#18958879)








