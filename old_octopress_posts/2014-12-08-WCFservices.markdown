---
layout: post
title: "WCF services - some take aways"
date: 2014-12-08 20:01
comments: true
categories: 
---


Why writing an entry on Microsoft WCF services I have been asked?!?

Well, in the absence of a copy of the Hitchhikers guide to the galaxy readily available, the path for al the knowledge and wisdom in the universe seems to pass through the MS exam 487 - Windows Azure.

The folks at Microsoft decided it to be fun for include WCF in the syllabus. So here are some notes and take aways from a couple of very interesting zerto-to-hero Pluralsight courses, from which most of this material is taken.

* [WCF Jumpstart](http://www.pluralsight.com/courses/wcf-jumpstart).
* [10 Ways to Build Web Services in .NET](http://www.pluralsight.com/courses/building-dotnet-web-services-10ways).

##Why should I use WCF?
##### #1 Don't worry about the plumbing
Windows Communication Foundation is an framework intended to minimize the effort in setting up communication between client and server side. It is a bit like a code first for Entity Framework, but instead of settign up a database with it, the code will then set up the API call and end points. Metaprogramming - code that writes code.
The basic idea is to address the issue of conventional RESTful APIs: the client side needs to have access to the access points and data structure required / returned in order to operate properly. This might be cumbersome during development. Enters WSDL (wiz-del).
Web Service Description Language AKA "(WSDL pronounced "wiz'-dul") is an XML-based interface definition language that is used for describing the functionality offered by a web service." from [Wikipedia](en.wikipedia.org/wiki/Web_Services_Description_Language).
The server side of a WCF service can outputs an XML file with the "documentation" for the access points + data expected and supplied, in WSDL format. The client side can read this and generate the calls to the access points automatically.
The idea is that, once the server side is set up, the client side can have a **code generated proxy**. The proxy is an object which will have the API calls as methods, and will provide access to the data types provided/required. Furthermore, the proxy can be updated later on in case the WCF service changes.
So neither the client nor the server side have to worry about the plumbing - as all is code generated. That is the idea.

 
##### #2 Ease to add access points
An additional advantace for WCF is the ease of adding access points.

WCF is purposefully configuration-heavy. It comes with App.config (if standalone) and/or Web.config (if hosted in ASP.NET) files, in which the endpoint are stated and specified.

This means that to add an extra end point to a method that I have available, say with a different binding, I don't need to touch the code but rather the configuration.

The interesting feature is that end points and business logic are separated. So it is very easy to add multiple end point (hopefully with different standards and bindings) for the same behavior.

##### #3 Share the models
Related to the points above, the client side does not need to have extra view model hard coded in, it can leverage to the data types that are coming through the wire automatically.

##what goes in the WDSL specification (and therefore in the WCF)
At the end of the day, the API will need the end points, the data and the methods. Let's define them.

#####Data entities
The WCF service needs to have reference to two packages for the serialization" **System.Runtime.Serialization** and **System.ServiceModel**.

This allows you to decorate the classes with the DataContract and DataMember attributes. In other words, you can specify what get serialized and send through the wire.

	namespace YourService.Entities
	{
   	 	[DataContract]
   	 	public class Customer
   		{
      	    [DataMember]
        	public Guid Id { get; set; }
    	    [DataMember]
	        public string FirstName { get; set; }
        	[DataMember]
    	    public string LastName { get; set; }
	        [DataMember]
        	public string Phone { get; set; }
    	    [DataMember]
	        public string Email { get; set; }
        	[DataMember]
    	    public string FullName { get { return string.Format("{0} {1}", FirstName, LastName); } set { } }
    	}
	} 

#####Operations available
Similar to above, the Service and Operations contracts are defined in the code. Note the reference to the entities.

	using YourService.Entities;

	namespace YourService.services
	{
    	[ServiceContract]
    	public interface IYourService
    	{
        	[OperationContract]
        	List<Product> GetStuff1();
        	[OperationContract]
        	void SubmitStuff(Customer customer);

	    }
	}


#####ABC of end points (configuration)
Each access point is defined by its ABC: 

* Address - usually protocol + servier + resource Uri (http://localhost2112/GetMePizza)
* Bindings - SOAP or JSON? (http, tcp, see [this fourm response](https://social.msdn.microsoft.com/forums/vstudio/en-US/c556519f-cdc3-4522-a41c-a2f402bc6275/types-of-binding-in-wcf) for the full rundown).
* Contracts - strcture of the data that is sent.

For example, in App.config OR Web.config an endpoint would look like this:

     <services>
       <services>        
        <endpoint address="net.tcp://localhost:2113/GetMePizza"
                  binding="netTcpBinding"
                  contract="Pizza.services.IPizzaService">
        </endpoint>
     </service>
    </services>

        
Now, adding another end point is a jiffy as well, no extra code but just add:


        <endpoint address="http://localhost:2113/Zza"
                  binding="basicHttpBinding"
                  contract=" Pizza.services.IPizzaService ">
        </endpoint>

And the end point **behavior** can be amended as well -  say to send the exceptions to the client side during development.

    <behaviors>
      <serviceBehaviors>
        <behavior>
          <serviceDebug includeExceptionDetailInFaults="true" />
        </behavior>
      </serviceBehaviors>
    </behaviors>


#####What is there in a WCF service (as a project)

A WCF project is basically a C# class which includes:
- App.config (endpoints).
- Service (Business Logic).
- Interface (ServiceContracts).
- Properties presets to run the debugging of the WCF service - smoke test.
- References to the Entities (DataContracts).

An alternative approach is rather to add the WCF as an item to an ASP.NET project. In this case, if you want to run debug on the WCF alone, you'd need to set the preferences manually (Debug -> Start External Project -> select the WCF test client .exe file in the .NET local folder)


##How to host the service during Development
There are three main ways to host a service:

- Debug in VS - smoke test.
- Console app (as an instance of ServiceHost).
- In an ASP.NET environment (remember that, if you host this in IIS it will work only with HTTP binding as a standard).


#####Console hosting
Out of the three I find the console hosting the most interesting, maybe as it is the most barebones. It is basically instantiate a ServiceHost and keeping it "alive".

		namespace ConsoleHosting
		{
   			class Program
    		{
        		static void Main(string[] args)
        		{

        			//use a try - catch is a good practice while setting up a host.
            		try
            		{
                		//instantiate the service
                		ServiceHost host = new ServiceHost(typeof(YourWCFService));

		                //start listening to incoming messages - as of the config it will be listening everywhere
       			         host.Open();

		                // now we need to keep this up and running for as long as we need
        		        Console.WriteLine("Hit any key to close this....");
                		Console.ReadKey();

		                // then we want to close in a graceful way
        		        // this means that the calls that are in progress will be fulfilled, but no new requests.
                		host.Close();

            		}
            		catch (Exception ex)
            		{
                
               			 Debug.WriteLine(ex.Message);
            		}
        	}
	    }
	}

	

Note that the end points are required in the App.config **of the console project**, and those do not need necessarily to be the same as the ones in the app.config **of the WCF service**. The former will be up for the console hosting, while the latter will be available for the debug - smoke testing.


Also note that, in order to run a WCF as a console app, you will need to turn off the "Start WCF service" in the Properties of the WCF service. This otherwise the service will start by itself as debug, and the console app will not get access to the end points.


	<system.serviceModel>
    <services>
      <service name="YourWCFService">
        <host>
          <baseAddresses>
            <add baseAddress="http://localhost:2112"/>
          </baseAddresses>
        </host>
        <endpoint address="EnfPoint"
                  binding="basicHttpBinding"
                  contract="IYourWCFService">
        </endpoint>
        <endpoint address="net.tcp://localhost:2113/EndPoint"
                  binding="netTcpBinding"
                  contract="IYourWCFService">
        </endpoint>
      </service>
    </services>

    
##Architecture of the Solution
Interestingly, but not surprisingly, the two courses I followed suggested two different architectures of the projects' organization:
 
* One with 5 namespaces
	* A WCF Service (Service Contracts in the Interface, business logic).
	* Entities (Data Contracts).
	*	Host.
	* Data (Entity Framework).	
	* Client.

OR otherwise

* 3 Namespaces:
	
	* ASP.NET application with a WCF item inside.
	* Data element (with Data Contracts, business logic around the data contracts, Entity Framework DbContext logic).
	* Client side.

The first implementation seems to me the more linear and easier to understand to me (especially for separation of concerns). In the second implementation I started to have issues with the implementation of the client side, due to clashing after having created the proxy (more on proxy later).

##The proxy element / client side 
One of the biggest reasons to set up a WCF service is to leverage the Web Services Description Language.

To review the main idea is that:
 
 * You don't have to worry about the plumbing as the client side can "learn" about it form the WSDL AND
 * It is easier to update the endpoint, as the reference can be updated.
 
Adding a service reference in the client project is very easy. Just Add -> Service reference to the client project. The same provides a system to update the reference.

Note that you can discover the service specification in a few ways. If the service is in the same solution and it is in an .svc file you have access to the code and there is no need to add anything else.

If instead the service is hosted in a console app / IIS you are better off starting that solution Without Debugging (so you can access and modify the code). The Add Service menu can at this point discover the service that is up and running.

Obviously, as the back end gets updated, the client side can be updated automatically too. That is a nice plus.

####Once you get the proxy

At this point the client side can instantiate a the proxy object, which has a method for each endpoint call made available by the server side (actually, it gives one method for the sync and one for the async). 

Also notable, on the client side you have access to the DataModels that are specified on the server side. This is even easier for the code if you add a reference for the client project to the project containing the Entities (another good reason to keep this separated).

For example, in order to reach an end point in the client controller all you need to do is:


	YourServiceClient proxy = new YourServiceClient("httpBasicBinding");
	// in case there are multiple bindings available you can pass the binding you want to the constructor
		
 	ObservableCollection<Customers> customers = proxy.GetCustomers();
 	
 
####Standaonle client side
Note that all this is possible also if the WCF service solution is hosted somewhere else (say in Azure) and you don't have direct access to the it namespace. At the end all you need is access to the WSDL specification for the service in order to generate the proxy element. 

I have not tried the second scenario, but I believe it is likely that the Firewall will need to be opne + CORS needs to be enabled for the API to work correctly.


An API call with two lines of code. Neat eh?