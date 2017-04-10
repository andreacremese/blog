---
title: 'Mongo  | Sql, a comparison'
date: 2016-09-26 10:44:35
tags:
    - C#
    - Entity Framework
    - MongoDb
    - SQL
---

One of the questions that often crops up at the outset of a greenfield project is if to choose Relational or Not Only Relational data persistance. In this article I will present a comparison of the two technologies concerning an actual (simplified) business case stemming from a Line of Business Application I am currently working on.

The results thus far favour MongoDB, either in its C# or NodeJS implementation. The SQL implementation took 60 % longer to conclude the required query - refer to the results below. In terms of "bang for bucks" (speed VS lines of code) node's result is truly amazing. 

This is a work in progress, but I wanted to share the results I gathered so far.

## Exec summary

### Outline

This quick study contrasts three different implementations to resolve the same business problem: find all objects in a table related to a certain other entity. The sample case assumed is that `Reports *<-------->* Engineers` (see image below). The test query is basically "find all reports that have an engineer with a certain name", assuming the engineer's _id is not known.

![Relationships](/images/relationships.png)

The three implementations under test were:

* Sql, C#, Entity Framework 6.1.
* MongoDB 3.3.4, C# MongoDriver
* MongoDB 3.3.4, Node MongoDriver.

SQL and MongoDB cannot be readily compared in terms of performance, therefore the comparison is made in terms of the monthly cost in Azure. The same budget was allocated for SQL and MongoDB (~15 $/mo). 

The load testing was done with the [NPM load test tool](https://www.npmjs.com/package/loadtest), assuming 4 concurrent queries, which is the forecasted load profile at the outset. 5000 Reports were seeded in the collection tested.

### Results

A preliminary analysis of the implementation proposed shows that the MongoDb implementation is faster than SQL in retrieving the required data, provided MongoDB > 3.3.4 is used. NodeJS is slightly slower than the C# implementation, by a small margin.


![Results](/images/comparison.jpg)


Interesting to note that with MongoDb =< 3.3.4 the aggregation on two collections needs to *$unwind* the nested collection, therefore making the handling the results difficult (as they would require to be re aggergated). [This was changed from 3.3.4 onwards](https://jira.mongodb.org/browse/SERVER-22881). The easiest solution using Mongo < 3.3.4 was to lookup the connected collection for the relevant entry. This was tested and it performed much worse than any other implementation (SQL or Mongo).


## Architecture rundown

Please refer to this [github repo](https://github.com/andreacremese/mongosql). 

The two C# access layers (EF 6.1 and MongoDriver) share the same API RESTful project. The Node access layer is wrapped into an Express API. The C# access layer share the the solution with the POCOs (for EF) and the driver layers.

The two API projects (C# and NodeJS) are deployed to two separate Azure App Services, with the same budget and in the same geographic location.

The databases tested are:

* SQL database on Azure, S0 size . Cost at the time of writing:  15 $ / mo.
* MongoDB 3.3.4, deployed on an Standard A0 Virtual machine hosted in Azure, Ubuntu 16.04.  Cost at the time of writing : 13.39 $ / mo.

## C# - EF implementation

The POCOs are set up as follows:

```
public class Report {
    public Report() {
        Engineers = new List<Engineer>();
    }
    public Int32 Id { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public String Title { get; set; }
    public ICollection<Engineer> Engineers { get; set; }
    public Topic Topic { get; set; }
    public Partner Partner { get; set; }
}

// ...

public class Engineer {
    public Int32 Id { get; set; }
    [Index]
    [MaxLength(40)]
    public String Name { get; set; }
    [Index]
    [MaxLength(40)]
    public String Email { get; set; }
    public ICollection<Report> Reports { get; set; }
}
```

Note that engineer's name and email are indexed (via EF). Please refer to the migrations generated for details.

The C# RESTful service accesses the resource passing in the Linq query required. For example, this is the controller method to retrieve all reports with a certain engineer name:
```
[Route("reportsbyengineername")]
[HttpGet]
public HttpResponseMessage getReportsByEngineer(string engineerName) {
    return Request.CreateResponse(HttpStatusCode.OK,
        _repo.getReports(r => r.Engineers.Any(e => e.Name == engineerName))
        .Select(rep => _mapper.mapReport(rep)));
}
```
The repo's method is as follows:


```
public List<Report> getReports(Expression<Func<Report, bool>> lambda) {
    using (var context = new dbpContext()) {
        context.Configuration.ProxyCreationEnabled = false;
        var linqQuery = context.Reports
            .AsNoTracking()
            .Include(rep => rep.Engineers)
            .Include(rep => rep.Topic)
            .Include(rep => rep.Partner)
            .Where(lambda);
        return linqQuery.ToList();
    }
}
```

Note that the mapping in the controller (`.Select` Linq method) required in order to prevent a circular structure for the response. 

This architecture was chosen because it allows to pass in and compose queries in an additive fashion, for example:

```
[Route("reports")]
[HttpGet]
public HttpResponseMessage getReports(
    String engineer = "", 
    String start = "", 
    String end="", 
    String topic = "",
    String partner = "",
    String enginerId = "",
    String partnerId = "",
    String topicId = "",
    String engineerId = "") {

    var startDate = start == "" ? new DateTime(2014, 01, 01) : DateTime.Parse(start);
    var endDate = end == "" ? DateTime.Now : DateTime.Parse(end);
    Expression<Func<Report, bool>> expression = r => r.StartDate < endDate && r.EndDate > startDate;

    if (engineer != "") {
        expression = expression.And(r => r.Engineers.Any(e => e.Name.Contains(engineer) || e.Email.Contains(engineer)));
    }

    if (topic != "") {
        expression = expression.And(r => r.Topic.Name.Contains(topic));
    }

    if (partner != "") {
        expression = expression.And(r => r.Partner.Name.Contains(partner));
    }

    Int32 eId;
    if (Int32.TryParse(engineerId, out eId)) {
        expression = expression.And(r => r.Engineers.Any(e => e.Id == eId));
    }
    
    Int32 tId;
    if (Int32.TryParse(topicId, out tId)) {
        expression = expression.And(r => r.Topic.Id == tId);
    }
    
    Int32 pId;
    if (Int32.TryParse(partnerId, out pId)) {
        expression = expression.And(r => r.Partner.Id == pId);
    }
    
    return Request.CreateResponse(HttpStatusCode.OK, 
        _repo.getReports(expression)
        .Select(rep => _mapper.mapReport(rep)));
}
```

### C# - MongoDriver Implementation

For the time being the implementation in the `MongoDriver` is as follows, with the aggregation performed explicitly.

```        
public async Task<List<BsonDocument>> GetReportsByPartnerName(String partnerName) {
            var collection = _database.GetCollection<MongoReport>(_reportsCollection);
            var aggregate = collection.Aggregate()
                .Lookup("engineers", "EngineerIds", "_id", "engineer_docs")
                .Lookup("partners", "PartnerId", "_id", "partner_doc")
                .Match(new BsonDocument { { "partner_doc.Name", partnerName } });
            return await aggregate.ToListAsync();
        }
``` 


__ Note that the aggregation above would not work on Mongo < 3.3.4, because .aggregate requires to $unwind the embedded list, creating a duplicate of each report for each engineer connected.__


As a side note, the Mongo implementation without the aggregation and with the manual lookups for the engineers have been tested with Mongo 3.2.9. Its performance was (much) slower than the aggregation version and slower than the EF SQL version. So, for many to many connection where the documents have to be kept in separate collections, don't use lookups BUT use .aggregation!

### Node - MongoDriver Implementation
This is very minimal, the whole `server.js` file is as follows.
```
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var connectionString = process.env.mongoConectionString || require('./connectionString.js');

app.get('/api/mongo/reportsbyengineername/:engName', function (req, res) {

	var engName = req.params.engName;

	MongoClient.connect(connectionString, function(err, db) {
		if (err) {
			console.log(err);
			res.status(400).send(err);
			return;
		}
		var collection = db.collection("reports");
		collection.aggregate(
		[
			{$lookup : { from : "engineers", localField : "EngineerIds", foreignField : "_id", as : "engineer_docs"}},
			{$lookup : { from : "partners", localField : "PartnerId", foreignField : "_id", as : "partner_doc"}},
			{$match : {"engineer_docs.Name" : engName}},
		]).toArray(function (err, docs) {
			res.send(docs);
		})
	});
})

app.get('/api/test', function (req, res) {
	res.status(200).send("OK");
} )
 

var port = process.env.PORT || 3000;
app.listen(port);
```

# Results

![Results](/images/comparison.jpg)

In terms of MongoDB, it is interesting to note that Node's fastest queries were faster than the C# counterpart, with half of them complete 1/2 % faster, but the slowest were slower by some 6%.

For this application and with this implementation, SQL was slower across the board, with the fastest 50% queries in SQL still slower than the residual 1% in MongoDB.


# Future developments

In the current implementation Mongo is deployed in a virtual machine, not as a service (for example, in MongLab). In order to provide a more fair comparison in terms of budget, a solution where Mongo (> 3.3.4) can be deployed as a service will be required.

The EF implementation is based off the excellent Pluralsight course [Getting Started with Entity Framework](https://www.pluralsight.com/courses/entity-framework-6-getting-started). The EF implementation will need to be reviewed for potential improvements.

The virtual machine where MongoDB is deployed to is in Central US (in order to use Classic VMs), while the Database is deployed in West US. As the tests are done in Seattle, this is an advantage for the relational solution. 