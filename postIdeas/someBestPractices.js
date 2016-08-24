### eval (evil)
eval allows you to inject js code and evaluate. This allows you to cheat on the lexical scope of JS, making for some very interesting code. 
Also, the compiler will have no idea what will come, so most of the optimization is turned off, for a much slower performance. 


### with
This is as well another possibility to screw up with the global scope and iject there some nasty varialbe

var obj = {
	a: 2;
	b: 3
}


with (obj) {
	a = b + 1:
	d = 3;
}
// this will make it create a d in the global scope

obj.d // undefined
d; // 3 ?????? wut?





### use let in the for loop

Use the let block scoping in order to follow the principle of least disclosure.
In that way the scope is not polluted with a var called i 

for (let i = 0; i < 2; i++) {
	console.log(i);
}

for (j = 0; i < 2; i++) {
	console.log(i);
}

i // Reference Error
j // is 2
// at this point i is not in scope anylonger, while with 

console.log(i);


### don`t use setINterval, rather go for setTimeout and recursively call it
This is because setINterval calls the passed in function no matter what. This means that, if the passed in function is a long running one, the operations may overlap.
On the other hand setTimeout does not execure unless the caller is done. This is much better as you have sequential execution, rather than executions piling up.s
