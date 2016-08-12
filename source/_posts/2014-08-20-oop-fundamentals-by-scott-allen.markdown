---
layout: post
title: "OOP fundamentals by Scott Allen"
date: 2014-08-20 12:45
comments: true
categories: 
---
Still on the [c# couse by Scott Allen on pluralsight][link0], some notes on OOP (they are never bad - let's face it).

####Three pillars of OOP?
* Encapsulation (primary pillar?).
* Inheritance.
* Ploymorphism.

Note again, [POODR][link1] starts out with encapsulation.

####Inheritance
"Inheritance, at its core, is an automatic message delegation system."

First note for c# - constructors are NOT IMPLICITLY INHERITED! Meaning you need to revert explicitly to the :base for their constructors:

    public class ConcreteClass1 : AbstractClass
    {
        public CocnreteClass1(string name)
        :base(name)
        {
        }
    }

Interesting to notice is the fact that when you instantiate an ConcreteClass1 in this manner, the constructor of the AbstractClass is invoked first, as classes are constructed "from the ground up".

Also note that private classes are not available to the inherited to or from classes. Protected type exists as well in c#.

The order for calling methods is dictated by the definition of the variable. In this case the implementation of SomeMethod will be called for the AbstractClass. Note that the code below is perfectly valid.
        
    FatherClass name = new SonClass();

        new.SomeMethod();
 
In the case below instead the implementation of the Concrete class will be called.

    ConcreteClass name = new ConcreteClass();
    new.SomeMethod();

In order to avoid collision of this sort, use the var could be used:

    var name = new ConcreteClass();
    new.SomeMethod();

In some cases this cannot be avoided, as you might have a return from a method and you might not know what implementation is returned, like in the example below:
    
    GradeBook book = CreateGradeBook();

I might not sure what sort of ctor will CreateGradeBook do. More on this later.

####Polymorphims
This is where virtual + override methods come into play. If the methods in the parent class are declared as virtual, the implementation to be invoked is decided at RunTime. This means that, if the object type (which might not necessarily be the variable type) has that method and that method is overridden, the specialized implementation (or, the implementation of the actual object) will be used.

    public class Car 
    {
        public virtual StartEngine()
         {
            //virtual tells the RunTime to search fro the implementation.
         }
    }

    public class Convertible : Car
    {
        public oveeride StartEngine()
        {
            //this implementation will be used.
        }
    }

    Car alfetta = new Convertibl().
    alfetta.StartEngine();
    
The code above will use the specialized implementation of the StartEngine method, because the implementation is searched at RunTime depending on the object type that is in the variable. 

Without the virtual/override, the generic implementation of StartEngine will be used, as the assignment is done depending on the variable type at compile time.


#####Concrete / Abstract
Note that Abstract classes in c# cannot be instantiated. In order to instantiate it you need to inherit into a concrete class. The idea is to stash into the abstract class all the behavior/information that is commonly shared across all implementations.

Note that abstract methods (i.e. the equivalent of a "not implemented" exception in POODR) are automatically virtual, so the concrete implementations are to be marked with override.


#####Interfaces
In lieu of abstract classes interfaces might be preferred. An interface is basically an **API for an object**.

The fundamental difference between interface and abstract / concrete classes is that **multiple inheritance is not supported, while I can implement multiple interfaces**. The interface is the ultimate abstraction. Also, a concrete class MUST implement all the interface methods - otherwise a compile error will be raised.

Interfaces do not have any implementation whatsoever. That is why an interface does not require the access limitation for methods or information (public/private/protected) as this is left to the concrete implementation. Also, interfaces are automatically abstract.



     public interface ICar
    {
        string Name {get; set;}
        void StartEngine();
    }
    //Note that neither of the above is an implementation (even though the property seems like an auto implemented one).

    public abstract class Car : Icar
    {
        private string _name;
        
        public string Name {get; set;}
     }

    //note that the : above DO NOT MEAN THAT THE CAR IS INHERITING, this is an interface! The : below instead is inheritance.

      public class Convertible : Car
      {
            public override StartEngine()
            {
            }
      }




    




[link0]:http://pluralsight.com/training/player?author=scott-allen&name=csharp-fundamentals-csharp5-m6&mode=live&clip=0&course=csharp-fundamentals-csharp5
[link1]:http://www.poodr.com/



