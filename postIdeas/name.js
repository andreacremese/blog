.filter method for arrays


// fill array with arrow functions expressions
const a = Array(5).fill().map((e,i) => i);
// filter method for arrays
filtereda = a.filter(e => e % 2 == 0);


var obj = {
	'some.function.here'() {
		return "I have a funny name";
	}
}

obj['some.function.here']() // "I have a funny name"