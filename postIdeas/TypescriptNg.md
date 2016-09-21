Patterns for NG and TS

what are we using as tsd manager (there is tds in npom, but I am not sure we are using it

Where is task.json and how is it used?

"controller as" systanx is the recommended pattern by Deborah Kyurata and John Papa

folder by feature" patterns is the recommended pattern by Debotah Kurata and John Papa

Interface for the controller to include all methods and properties disclosed to the view, otherwise it makes no sense

Shape up the html file with the sections for the script tags

Where is concatenation and minfication for publishing? task runner in gulp / grunt?

ts modules are the pattern to make classes into iifes.
The modules we will write are internal modules, as we are not putting together requireJS or node modules IIFEs are needed in order to prevent name collision and similar

Export classes only if they are used outside, for example for a service. Otherwise it does not make much sense, and the controller class should remain encapsulated

Pluralsight NG for line of business app