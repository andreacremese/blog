add ons to the blog post regarding arrow functions:


The this is not really a lexical scope, it is a different mechanism, somewhat akin to dynamic scope (check this one out)
There is no crossover from the this keyword and the local lexical environment. Meaning accessing stuff on the this. is a mechanism
while the lexical scope is a completely different mechanism.

JS does not have dynamic scope. The decidions for what is in scope are made during the lexical part of the compiler. Scope is at compile time decision.
In other words, by making the decision of where the functions are at compile (author) time.

Eval => it allows you to pass in code as a string BUT that is cheating on the lexical scope - but all of the sudden the optimization 
in JS does nto work anylonger. IN case you have metacode (code that writes code) you may end up uwsing eval.

The with keyword is as well evil, as it creates another lexical scope.



You create a scope with either a function, a try catch or a let with a curly braces.




