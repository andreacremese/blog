---
layout: post
title: "Delegates in C#! (and other interesting stuff)"
date: 2014-08-07 15:46
comments: true
categories: 
---

In my quest for the ultimate knowledge and wisdom in software engineering I have started learning c#. I am currently following [this very interesting course][link1] by Scott Allan on Pluralsight. The post below are my personal notes on the fourth chapter of the book - Delegates.


####Fields VS properties
**Field**: also called **backing fields**, are one of the information encapsulated in the instance of an object. Note that fields are supposed to be encapsulated in the object and not public (i.e. keep them private). The public interface of a field is a property (see below). The convention for fields is to be named with an underscore before their name.

**Property**: the public interface that exposes backing field(s). Referring back to POODR, it is part of the public "messaging" that the instances of classes send one another. Each property comes with a get and a set (remember attr_accessor in POODR? Same thing). The convention is to have the property name CamelCased.

	//This is the field
	private string _name

	// This is the property		
	public string Name {
		get {
			return _name
			}
		set {
			_name = value;
			}
	}


####Delegate type
It is a data type that references listener methods. Even though it is a data type, its definition looks like that of a method. As it encopasses behavior, this is not too surprising. 

	public delegate void Name_Of_Delegate(string some_string);
	
At some point you will have a variable referencing the delegate data type (as you do in JS, for example):
	
	var delegate = new Name_Of_Delegate(a_previously_defined_string); 

In this case the delegate takes a string, more on this later.

####Listening to property change
Ok, now for the main dish. Say that I can change the name of a certain instance of an object (property Name, backing field= _name). Say that I want to "announce" that someone has changed the name to a listener. I'd do that with a delegate (see above) that will contain all the behavior to be activated at name change.

First, in the property get/set:	
* Make sure it is indeed a new value.
* Make sure that someone is interested in the fact that the name has changed, otherwise I will get a RunTimeError.
* Make sure the delegate is an event (see its definition, more on this later).

        private string _name;
        public event NamedChangedDelegate NameChanged;
        
        public string Name        {            get            {                return _name;            }            set            {                if (_name != value)                {                    var oldValue = _name;                    _name = value;                    if (NameChanged != null)                    {                        NameChangedEventClass args = new NameChangedEventClass();                        args.OldValue = oldValue;                        args.NewValue = value;                        NameChanged(this, args);                    }                }            }        }
####Delegate and EventThe NameChangedDelegate is the delegate that we were discussing before. The intersting part is that the instance of the class who's name is changing has absolutely no idea about what methods are rolled in the NameChangedDelegate, s/he only knows that someone might be listening. This is a great **decoupling**!
	// the delegate - good practice to encapsulate in a different class file	    public delegate void NamedChangedDelegate(object sender, NameChangedEventClass args);Note that the delegate takes in two elements: the sender object and the arguments that he might be interested into. This is a convention in c#. The arguments that he might be interested into are ecapsulated in the instance of a class callsed NameChangedEvent - that we will have to create as well.      
	// The class to encapsulate of the values that delegate might be interested into. Good practice to encapsulate in a different class file		
	    public class NameChangedEventClass : EventArgs    {        public String OldValue{ get; set; }        public String NewValue { get; set; }    }		

Note that the class inherits from the EventArgs class.

####Registering the listenersNow, wherever I want to listen to the name changing I'd need to register my event listener. The event listener will be a method that does, well, pretty much what I want it to do, when the name changes. Note that the fact that in this case it is a class (static) method is only pertinent to the example at hand.
	//this is the registration of the method 	my_sample_class.NameChanged += 	OnNameChanged;
	
		//this is the method to be activated	        private static void OnNameChanged2(object sender, NameChangedEventClass args)        {            Console.WriteLine("Name changed from {0} to {1}", args.OldValue, args.NewValue);        }

Note that += is required in order to avoid overwriting the existing listeners that might already be in existance. This is because the delegate is a **multicast delegate**, meaning it can have a list of elements inside (so you'd better add to the list, rather than risking re initializing the list). 

Events do not allow anyway to initialize, but only to add and delete (as the NameChanged is specified as a *public event ...*).


####Interesting note
The delegate takes in the full sender object. This is a standard pattern in C#. This reminded me of the pattern for modules (mixins of behavior) in Ruby as proposed by Sandy Metz in the POODR book, refer also to this [link]. 

As the C# delegate is basically behavior (what would be a module in Ruby), this pattern is similar, even though reversed in a way. It is the sender that passes itself to the module (event) - rather than the module (event) passing itself to the implementing class. Just some food for thought.


[link]:http://andreahk5.github.io/blog/2014/04/22/chapter-7-of-poodr-modules-and-inheritance-extended-edition/ 

[link1]:http://pluralsight.com/training/Player?author=scott-allen&name=csharp-fundamentals-csharp5-m4&clip=4&course=csharp-fundamentals-csharp5



