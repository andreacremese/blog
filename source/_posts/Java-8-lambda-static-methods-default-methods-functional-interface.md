---
title: 'Discovering Java 8: first notes'
date: 2017-06-08 13:43:19
tags:
    - Transitioning to Java
    - Lambda 
    - Static and default methods
    - Functional interfaces
---
# Discovering Java 8: first notes
**a.k.a. lambda, static methods, default methods, functional interface**

I just joined **[smartsheet][7]**, a Bellevue WA based Saas with a very interesting product and an amazing culture driven by some truly inspiring and inspired leadership. I am really enjoying the company, so hit me up in case you are interested in joining (I definitely **cannot** give away the code challenge in advance, in case you are wondering). 

The back end stack is in Java and so I am currently ramping up and transitioning from C# to Java. This post (which is very likely to become a series of posts) comprises some of my notes on some of the aspects that I found new, interesting or surprising after landing on planet Java. 
 
 It is a mixin of Java specifics, Java 8 specifics, and some of the first watch its for the c# developer that is getting in Java world. A code snippet involving most of the concept that are reported is added at the end of the post for future reference. 

## Static methods on interfaces

Java does not have static classes, unless the static class is nested in another class. This means that the following **is not supported** in Java:

```
public static class MyMixIn() {
    public static Int double(Int32 i) {
        return 2 * i;
    }
}

/// consumer, somewhere else in code 
    Int32 result = MyMixIn.double(3);
``` 

Nonetheless, Java allows this pattern on `interfaces` see Static Methods in the [specs]][2]. Meaning, the following is perfectly valid:

```
public interface MyMixIn() {
    public static Integer double(Integer i) {
        return 2 * i;
    }
}

/// consumer, somewhere else in code 
    Integer result = MyMixIn.double(3);
```
Note that the mix in is of type `interface`.

## Default methods on interfaces
Another quirk that interfaces allow in Java is providing default implementation for the methods it specifies. This functionality is probably the most surprising to me, on the notion that an interface should not really have any implementation associated with it. 

Its seems like this was added to allow rewriting of some of the languages interfaces, without breaking the code that actually inherits from them (from the [specs][4]). This remains surprising to me, but the reason behind may be tied to the preventing breaking changes to existing interfaces. Java does allows for implementation of multiple interfaces, but single inheritance.

Now, the default method only works when you instantiate an anonymous class newing up the interface (see below). If you do the following, the **super** will call the Parent class.

```
@FunctionalInterface
public interface MyPredicate<String> {
    boolean test(String t);

    default boolean test(String t) {
        return t.length() > 4;
    }
}

// Parent
public class Parent {
    public boolean test(String s) {
        return s.length() > 7;
    }
}

// Child
// note that both the Parent and the interface have an implementation of .test
public class Child extends Parent implements MyPredicate<String> {
    public boolean test(String s) {
        return super.test(s);
    }
}

// test
@Test
public void ensureParentInherits(){
    // arrange
    Child c = new Child();
    // test
    boolean result4 = c.test("1234");
    boolean result8 = c.test("12345678");
    // expecting parent to win
    assertFalse("interface got implemented instead", result4);
    assertTrue("interface got implemented instead", result8);
}
```

## Newing up interfaces in anonymous classes
Java has the concept of anonymous classes. An anonymous class is a class that is declared and instantiated at the same time (from the [specs][1]). This is usually implemented by "newing up an interface" (yes, you read it right):

```
    static void compareWithAnonymousClass(String[] strings) {

        Comparator<String> comp = new Comparator<String>() {
            public int compare(String s1, String s2) {
                return Integer.compare(s1.length(), s2.length());
            }
        };
        Arrays.sort(strings, comp);
    }

    // The signature of Compare is
    public interface Comparator<T> {
        //...
    }
```
At first this sounds confusing (newing up an interface?!?!?!?!?) and not very performant (it does smell like boxing and unboxing would come up the pike). Actually, when compiled, the anonymous class generates a separate class, therefore not having any performance hit. 

On the confusing side, this sounds like a piece of functionality that can get easily abused, but in the right hands may actually prevent the requirement to create return classes / DTOs / similar that would have a single use.


## Functional Interfaces and lambda expressions
This sounds like the Java's response to (very powerful) idea of *delegates* in c#. A functional interface is an interface with **only one abstract method** from the [specs][3]. As a result, when you new it up (see previous point), you can pass a single **lambda expression** as a method implementation, and the compiler knows that (by default) that is the method that is implemented.

Meaning:

```
// MyPredicate.java
// a personal implementation of Predicate
@FunctionalInterface
public interface MyPredicate<T> {
    boolean test(T t);
}

//...

// ConsumerWithAnonymousClass.java
    MyPredicate<String> p1 = new MyPredicate<String>() {
        public boolean test(String s) {
            return s.length() > 5;
        }
    };

//...

// Consumer with lambda
    MyPredicate<String> p1 = str -> str.length() > lo;

```
Note that the specification do require only one abstract method for an interface to qualify as a **functional interface**. Meaning, the interface can have default methods and / or static methods and still qualify as a functional interface (see the example at the end of the page.

## Method reference
This is a nifty shortcut which, at first, looks very confusing (especially with some experience in Ruby and Rails). This is a specific sintax to call a method in a class in a lambda expression (see [specs][5]).

Meaning, the two following lines are absolutely equivalent:

```

// lambda with method call
Function<Person, Integer> f = person -> person.GetAge ();

// method reference
Function<Person, Integer> f = Person::GetAge ;
```

This works as well for methods with two parameters. For example, the following is equivalent:

```
BinaryOperator<Integer> myOperator = (a, b) -> Integer.max(a,b);

// is the same as

BinaryOperator<Integer> myOperator = Integer::max;
```

## Wrapping up

An example of a functional interface, with default AND static methods.
```
@FunctionalInterface
public interface MyPredicate<T> {
    boolean test(T t);

    default MyPredicate<T> and(MyPredicate<T> other) {
        return t -> test(t) && other.test(t);
    }

    default MyPredicate<T> or(MyPredicate<T> other) {
        return t -> test(t) || other.test(t);
    }

    // with a single type
    static MyPredicate<String> isEqualString(String string) {
        return s ->  s.equals(s);
    }

    // with generics
    static <U> MyPredicate<U> isEqual(U u) {
        return s ->  s.equals(u);
    }
}
```

Example of the consumer of said interface:
```
    static Boolean lengthBetweenTwoIntergers(String s, Integer lo, Integer hi) {
        // using anonymous class
        MyPredicate<String> p1 = new MyPredicate<String>() {
            public boolean test(String s) {
                return s.length() > lo;
            }
        };
        // using only method in the functional interface 
        MyPredicate<String> p2 = str -> str.length() < hi;
        // using default method implementation
        MyPredicate<String> p3 = p1.and(p2);
        return p3.test(s);
    }

    // using a static method
    public Boolean isEqualToOne(Integer i){
        MyPredicate<Integer> p1 = MyPredicate.isEqual(1);
        return i.test(1)
    } 
```

*Some of the notes are inspired by the Pluralsight course "From Collections to Streams in Java 8 Using Lambda Expressions" at this [link][6].*


[1]:https://docs.oracle.com/javase/tutorial/java/javaOO/anonymousclasses.html
[2]:https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html#static
[3]:https://docs.oracle.com/javase/8/docs/api/java/lang/FunctionalInterface.html
[4]:https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html
[5]:https://docs.oracle.com/javase/tutorial/java/javaOO/methodreferences.html
[6]:https://app.pluralsight.com/library/courses/java-8-lambda-expressions-collections-streams/table-of-contents
[7]:https://www.smartsheet.com/