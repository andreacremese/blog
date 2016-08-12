var MongoClient = require('mongodb').MongoClient;
var fs = require('file-system');
// database cloned locally, production db is behind firewall and does not require open access as it runs on the 
// server where the app runs as well 
var url = 'mongodb://localhost:3001/meteor'

MongoClient.connect(url, function(err, db) {
	if (err) {
		console.log("could not connect to db " + err)
		return;
	}
	console.log("Connected correctly to server.");


	/**
	This is the interesting part of the sample. In order to pass in some context to the handler you can use closuer
	use a handler that basically returns the function that you want to execute with the context. nifty
	*/

	// Also, try to do this with hard binding : make a copy of the handler and use a .call
	// handler = function(data) {processData.call(data, "nameOfTheFile")};
	// Kyle simpson, advanced JS, Explicit binding (use a .bind)

	function processData(nameFile) {
		return function (err,data) {
			if (err) {
				console.log("! error " + err);
				return;
			}
			if (!nameFile) {
				console.log ("please specify file name");
				return;
			}
			var wstream = fs.createWriteStream(nameFile);
			for (var i = 0; i < data.length; i++) {
				var name = data[i]._id == "" ? " (Empty String) " : data[i]._id;
				name =  name || "null";
				wstream.write( name.replace("\n", " ") + "\t" + data[i].count + "\n");
			};
			wstream.end();
		} 
	}

	var developerVisits = db.collection('developerVisits');
	
	// across all history
	//devAndProject = 
	developerVisits.aggregate([
		{ $project : { name : {$concat : ["$developerName", " | ", "$projectName"] }, _id : 0}}, 
		{$group : { _id : "$name", count : {$sum : 1} } }, 
		{$sort : {count : -1}}])
	.toArray(processData("developerAndProjects.tsv"));
	// onlyDev = 
	developerVisits.aggregate([
		{ $project : { name : "$developerName" , _id : 0}}, 
		{$group : { _id : "$name", count : {$sum : 1} } }, 
		{$sort : {count : -1}} ])
	.toArray(processData("developerOnly.tsv"));
	//onlyProject = 
	developerVisits.aggregate([
		{ $project : { name : "$projectName", _id : 0}}, 
		{$group : { _id : "$name", count : {$sum : 1} } }, 
		{$sort : {count : -1}}])
	.toArray(processData("projectOnly.tsv"));

	//only2015
	var dateMatcher = {$match : {visitStartDate : {$gt : new Date(2015, 0, 1)}, visitEndDate : {$lte : new Date (2015, 11, 31)}}};
	
	developerVisits.aggregate([
		dateMatcher,
		{ $project : { name : {$concat : ["$developerName", " | ", "$projectName"] }, _id : 0}}, 
		{$group : { _id : "$name", count : {$sum : 1} } }, 
		{$sort : {count : -1}}])
	.toArray(processData("developerAndProjects2015.tsv"));
	// onlyDev = 
	developerVisits.aggregate([
		dateMatcher,
		{ $project : { name : "$developerName" , _id : 0}}, 
		{$group : { _id : "$name", count : {$sum : 1} } }, 
		{$sort : {count : -1}} ])
	.toArray(processData("developerOnly2015.tsv"));
	//onlyProject = 
	developerVisits.aggregate([
		dateMatcher,
		{ $project : { name : "$projectName", _id : 0}}, 
		{$group : { _id : "$name", count : {$sum : 1} } }, 
		{$sort : {count : -1}}])
	.toArray(processData("projectOnly2015.tsv"));
	
	db.close();
});