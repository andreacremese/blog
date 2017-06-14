---
title: Streams (for tests assertions)
date: 2017-06-13 17:33:46
tags:
    - Java 8
    - Streams
---


# Streams
## Brief Brackground 
One of the features I stumbled across in Java 8 is [Streams][1]. While streams exist in `c#`, they are usually employed for I/O operations (e.g. reading from files). The idea of stream is to provide a lightweight manner to iterate through "stuff", without making a copy of that (that would bloat memory use and what have you). 

One of the classic uses is in Map-Reduce problem, keeping in mind two big caveats:

1. Use an associative function for the reduce step. Associative meaning `f(a, f(b,c))) == f(a, b) c))`.
2. Use the correct identity (e.g. `1` for multiplication and `0` for sum, or also `f(IDENTITY,a) == a`.

This is especially important in case of parallelizzation, but that is outside today's small scope.

## Use in tests
I noticed a tendency When writing tests, especially when operating on arrays, to use `for` loops with nested assertion. 
Meaning, use a convenience method like the following to test if the elements in an array are sorted:

```
private void TestSortedArray(int[] arr) {
   for (int i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            Assert.assertFalse("array not sorted", true);
        }
    }
}
``` 

Now that is fine, but it is not that legible. Also, in other context, may force to store intermediate elements / copy the array in another structure. Enters the `stream` API in Java 8, where I can do things like:

```
// same method as before, but with the Stream API that Java 8 gave us
private void TestSortedArrayWithStream(int[] arr) {
    Arrays.stream(arr).reduce(Integer.MIN_VALUE, (min, elem) -> {
        Assert.assertTrue("array not sorted", elem > min);
        return Integer.min(min, elem);
    });
}
```

Noting that:

1. `Integer.min` IS an associative operation.
2. I am using the identity operator (`Integer.MIN_VALUE`) for the reduce.

## Full test class

Here's the full class (implementation of `Bubble sort` omitted, also as I just needed something to play with the stream API in the first place).

```
public class PlayingWithStreamsAlgoTest {

        @Test
        public void canBubbleSortWhenInInverseOrderAndWithDuplicate() {
            // arrange
            int[] arr = { 3, 2, 1, 1 };
            // act
            Sorting.BubbleSort(arr);
            // assert
            TestSortedArray(arr);
            TestContains(arr, new int[] { 3, 2, 1 });
            // assert - with streams!
            TestContainsWithStream(arr, new int[] { 3, 2, 1 });
            TestSortedArrayWithStream(arr);

        }

        private void TestSortedArray(int[] arr) {
            for (int i = 0; i < arr.length - 1; i++) {
                if (arr[i] > arr[i + 1]) {
                    Assert.assertFalse("array not sorted", true);
                }
            }
        }

        private void TestSortedArrayWithStream(int[] arr) {
            Arrays.stream(arr).reduce(Integer.MIN_VALUE, (min, elem) -> {
                Assert.assertTrue("array not sorted", elem > min);
                return Integer.min(min, elem);
            });
        }



        private void TestContains(int[] arr, int[] elems) {
            HashSet<Integer> set = new HashSet<Integer>();
            for(int e : elems) {
                set.add(e);
            }
            for (int i = 0; i < elems.length; i++) {
                Assert.assertTrue("Extraneous element in sorted array",set.contains(arr[i]));
            }
        }

        private void TestContainsWithStream(int[] arr, int[] elems) {
            HashSet<Integer> set = new HashSet<Integer>();
            for(int e : elems) {set.add(e);}
            Arrays.stream(arr).forEach(e -> Assert.assertTrue("Extraneous element in sorted array",set.contains(e)));
        }
}

```



[1]:https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html
