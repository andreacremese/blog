---
title: Web Workers
date: 2014-09-04 11:33
tags:
	- JS
---
Some notes form a quick Pluralsight course by Craig Shoemaker about web workers.

#### Web workers

They are targeted at AJAX work, for labour intensive processes that will take time to finish up and might significantly impair the UI of the page. Seconding the work to a web worker will not lock up the UI wile long threads are going on. It is, in a way, a manner to create multi thread programming.

Some of the uses include: 3D rendering, API responses, encripting, statistical analysis, CFD, messaging in social network. They can be:

* dedicated (they are linked to the their creator).
* shared (they can be called by any number of scripts).


Note that **IE < 10 does not support them**.

#### Access restrictions
There are some quite severe access restrictions for the web workers:

* No access to the DOM - the UI is kept completely separate.
* No access to the window object.
* No access to host page + libraries.

In other words, fun encapsulation. There si access to:

* appName
* appVersion
* platform
* userAgent
* Timers
* HttpRequests

#### How to set up

##### Instantiate (DOM)
Instantiate a Worker object in the DOM. Note that the worker logic sits in a separate file.

	var worker = new Worker('name_File.js');

##### Register the events handlers (DOM)
Register the handlers for the events that the worker might fire:

	worker.onmessage = messageHandler;
	worker.onerror = errorHandler;
	worker.postMessage(argument);

The worker gets information and arguments by receiving messages and sends back information by responding to those messages with other messages. 

##### Defining the events handlers (DOM)
messageHandler method will be the way the DOM will respond to the success of the worker.

	function messageHandler(e){
		var results = e.data;
		// chew the output of the worker
		
	};

e will be the response that is spitted out by the web worker.	
Of course it would be good practice to handle the error as well

	function errorHandler(e) {
		// do some sort of catching
	
	};
	

##### Setting up the worker
The web worker has mainly two parts inside: 1) the function and logic that is to be performed and 2) listener for incoming messages. Part 2 goes like this:

	addEventListener("message", some_function, true); 

When a message is passed (whatever message, note) the some_function handler method is called.

An alternative to the addEventListener method is to define directly an "onmessage" function.

	// this is equivalent to the addEventListener to the worker
	onmessage = function (e) {
		 //do the thing
	}
	
The onmessage function can be assigned as well to the worker's global scope. This means that the onmessage can be rewritten appending the function to the scope.

	self.onmessage = function (e) {
		 //do the thing
	}	
	

The way to comunicate back to the main thread is to post messages back.

	postMessage(the_local_results). 
	
**note**: the method that is used to communicate back and forth between worker and main thread is the same: postMessage().

#### Use
The DOM and the web worker communicate through the postMessage method. Let's see how this can work.

##### Passing arguments around
It is good practice not to send and return simple strings or instances of atomic data types, but rather send objects.
	
	//in the DOM:
	var args = {InputData: {}, OutputData: {} };
	//...
	worker.postMessage(args);


	// in the worker
	function messageHandler(e) {
		var args = e.data;
		// do the logig and modify the args
		
		postMessage(args);
		
	}
	
	addEventListener("message", messageHandler), true);

Note that args is passed by value, meaning that whatever change it is made to the args in the worker will not be reflected to the DOM unless you specifically pass the args over and they are considered and read.

##### With AJAX

The same basic architecture is used, but the postMessage in the web worker will be called when the http request has finished (meaning status 200 and ready state 4). Only at that point I will send the message back to the DOM.

	if (xmlhttp.readySTate == 4 && html.status == 200) {
		postMessage(xmlhttp.responseText)
	} 


##### How to stop
There is no way to pause a worker while it is doing what he does. The two options are to wither terminate or close. 

Terminate is an abrupt termiation of the code, from the DOM environment.

	// kill the worker
	_worker.terminate();
	
Closing instead leaves some time and cleans up the memory. This needs to be initiated with a postMessage from the DOM, with a message hidden in the args (OR in the method signature).

The code inside the worker is to close().

	// in the DOM
	_worker.postMessage({Command: "close", value: "some value", message: "some message"})
	
	
	// in the worker handler (messageHandler)
	
	if(e.args == "close") {
		this.close();
		// prepare the args that are to be passed back
		postMessage(args);
	}
	

	
	




