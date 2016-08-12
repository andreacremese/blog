	---
layout: post
title: "Unit Test in C#, preparing the env before each run"
date: 2014-08-04 17:35
comments: true
categories: 
---
All right, new life with C#. First week: unit testing!

In order to get familar with the thing I looked into setting up a simple unit testing for bubbling sorting algo that I put toghether. There a cool explanation for unit testing in c# at this [link][1].

Nonetheless one of the aspects I wanted to achieve (and that is not explained very well at the link) was to **prepare** the testing environment **before** each test method. 

This is done with a "Test Initialize" and "Test Cleanup" methods. Note that the element (in this case a list) that is used for the test is initialized as a class (static) method for the unit test class.




    namespace UnitTest
    {
        [TestClass]
        public class BubbleSortTest
        {   

            private static List<int> randomList;    

            [TestInitialize]
            public void Initiaize()
            {
            	// preparation of the env for each resting
                int Max = 20;
                int Min = 0;
                var rnd = new Random();
                randomList = Enumerable.Range(Min, Max)
                                        .OrderBy(item => rnd.Next())
                                        .ToList();
            }   

            [TestCleanup]
            public void Cleanup()
            {
                // cleaning up local variables after the test
                randomList = null;
            }   

            [TestMethod]
            public void TestBubbleSort_Success()
            {
            
				//Test # 1       
            
            }
            
            [TestMethod]
            public void TestBubbleSort_Fail()
            {
            
				// Test #2
            
            }   

        }
    }
[1]: http://msdn.microsoft.com/en-us/library/ms182517(v=vs.100).aspx