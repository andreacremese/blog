---
title: "Mocks with Node + Express"
date: 2015-05-07 22:06:21 -0400
comments: true
tags: 
	- JS
	- node
	- express
---

When developing apps with RESTful APIs interfaces there is often the need to setup a quick and temporary Mock site that would return some pre canned Json depending to a the request made.

While there are many sites around that allow you to do exactly that (APIary is one that jumps to mind right now), in many cases these only allow a static one-to-one correlation between request and responses.  In other words, the behavior is usually: "when I send this reply with that", so on and so forth. 

While this is great for documentations, in some (many) cases during development there is a need to **return different responses to the same request**. This may to test different business scenarios, simulating systems down, and so on and so forth.

There are many way to achieve this, one that I personally like is to leverage Node + Express. Note that following server is fully functional but it is **for demo only**.

			var express = require('express');
			var morgan = require('morgan');
			var bodyParser = require('body-parser');
			var cors = require('cors');
			var fs = require('fs');			
			

			var app = express();
			var port = process.env.PORT || 3000;			

			var jsonParser = bodyParser.json({ type: 'application/*+json' });			

			app
			    .use(cors())
			    .use(jsonParser)
			    .use(bodyParser.json())
			    .listen(port);					

			app.post('/api/mockedrequest', function (req, res) { handleRequest(req, res); });
			app.post('/api/overrideResponse', function (req, res) { overrideResponse(req, res); });			



			// Mappings requests => replies 
			// Should go in a config module, really
			var TestCasesMappings = {
			    "Account1": { code : 200, responsefile : "./TestData/TestCase1.Response.json" },
			    "Account2": { code : 200, responsefile : "./TestData/TestCase2.Response.json" }, 
			    "Account3": { code : 200, responsefile : "./TestData/TestCase3.Response.json" },
			    "Account4": { code : 400, responsefile : "./TestData/BadRequest.Response.json" },
			    "Account5": { code : 503, responsefile : "./TestData/Unavailable.Response.json" },  
			    Default: { code : 200, responsefile : "./TestData/TestCase1.Response.json" }
			};	


			// API behavior
			// Sould go in an API module, really
			var ResponseOverriddenAccount;			

			var handleRequest = function (req, res) {
			    if (ResponseOverriddenAccount != null){
			        var required_response = (ResponseOverriddenAccount in TestCasesMappingsMapping ) ? ResponseOverriddenAccount : "Default"; 
			    } else {
			        var required_response = (req.body.Account in TestCasesMappings ) ? req.body.Account : "Default"; 
			    }
			    var response_code =  (TestCasesMappings[required_response]).code;
			    var filepath = TestCasesMappings[required_response].responsefile;
			    var message = JSON.parse(fs.readFileSync( filepath , 'utf8'));
			    res.send(response_code, message );
			};			

			var overrideResponse = function (req,res) {
			    if ("Account" in req.body){
			        ResponseOverriddenAccount = (req.body.Account in TestCasesMappings) ? req.body.Account : null;      
			    }
			    var msg = (ResponseOverriddenAccount == null) ? "Default behavior re instated" : "Response now switched to  " + ResponseOverriddenAccount + " for all requests";
			    res.send(200, msg);
			}  	
			
			

			
In the code sample there is one mapping literal that maps request to response with an Account key in the request (so far, easy). This means that a request to the ```/api/mocked``` end point with a payload "Account" : "Account1" will be responded with the json TestCase1, mapped as per the literal **TestCasesMapping**.

So ```curl -X POST -d  '{"Account" : "Account1"}' http://localhost:3000/api/mockedrequest --header "content-type: application/json"``` will return a 200, with payload as in the relative file.

Now, in order to be able to modify the behavior, another end point is provided at ```/api/overrideResponse/```. This accepts the behavior (account) that should become the new default for all requests OR, as and option, a reset to the original mapping. 

So ```curl -X POST -d  '{"Account" : "Account1"}' http://localhost:3000/api/overrideResponse --header "content-type: application/json"``` will make the server respond to all requests with the TestCase1, so on and so forth. Sending ```'{"Account" : null }'``` null will reset the responses to the original default.

No need to restart servers, swap files or anything similar.

### One word of caution
 
The server above is a display example. In order to achieve this behavior on a larger scale it is better practice not to pollute the global scope, and instead:

* Have the mapping in a separate module (configs), and inject the literal with the mapping in the server (or better yet in the api module) as needed.
* Have the functions handler in a separate api module as well (together with the var holding the status of the override), so to inject them as needed.