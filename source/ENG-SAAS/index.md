---
title: <ENG + SAAS>
date: 2017-06-13 18:01:50
---

# The SAAS cheatsheet for software engineers 

A mix in of terms and concepts for `Software Engineers` interested in `SAAS` business. These are some of the concepts I think are interesting & relevant for someone starting up, among the various concepts I ran across while working at various companies and going through biz school.

The page is under construction =). These notes are supposed to be helpful, not exhaustive. If you have any correction (or want to discuss), please reach out!!!!

## Metrics

### ARR
This can be the `Accounting rate of return`, it is a measure to assess the variation in the value of an asset on a year basis. (value_@_end - value_@_beginning) / value_@_beginning. For a firm, this can mean the total capitalization OR using the profits and the capitalization at beginning of the year.

But in SAAS startups that have a subscription model it much more likely that this means `Annual Recurring Revenue`. It is calculated by taking the total of subscription contracts that have been closed and divided for the length of said contracts (expressed in years). This is a measure of the projected income from signed up subscription per year. Note that subscriptions that can be cancelled monthly do not contribute to the ARR, but a year commitment that is paid monthly does contribute to the ARR.

ARR is sometimes computed for certain classes of customers: new customers, recurring, churned. Definitely not a GAAP measure!

### CAC
Customer acquisition cost - basically how many dollars does it cost to get one extra paying customer through the `marketing funnel`. Needs to be smaller than Life Time Value, otherwise the math do not works.

### LTV (CLTV, LCV and various permutations)
(Customer's) Life Time Value  - how much revenue will the customer will generate over its lifetime (as a customer). Needs to be greater than Customer acquisition cost, otherwise the math do not works.

### Run Rate
Pro rata the earning of a single period (say, a quarter) to a year. This is a measure of a business top line that presumes no growth (or decline, for that matter) as it takes current performance and takes that as the bases for the full year. Imagine taking the sales on black friday and project to the full year...Obviously, not a GAAP measure.

### Burn rate
Loss per month. How much it is spent per month above the revenue (in a startup and during launch, cost of good sold will inevitably be smaller than the revenue, hence a loss). From this you get the concept of `runway`. This is the amount of time a startup can remain a going concern assuming the current burn rate is constant.

### Churn
How many existing customers leave in a certain time period. Depending on the business, healthy SAAS can have overall churns of 10%, but read on. The trick in this rate is that not all churns are made equal. Churn is physiological for SAAS, there is no way of getting rid of that. BUT the measure to really look at is the churn for **customer that are above a certain yearly billing a year** (e.g. 5k/10k). If that is in double digit, start asking questions.

### Engineers to Salesman/Marketing ratio
Very very very crudely and depending on loads of factors, it's somewhere in the 2:1 ballpark (see [this analysis](http://tomtunguz.com/saas-spend-allocation-benchmarks/), for example). Meaning, two sales / marketing people for each engineer. Anyhow, the point is that sales and marketing is really important (not all engineers may appreciate, especially at the beginning of their career). 

There is definitely more than this, but if here's another point: "Balanced teams with one technical founder and one business founder raise 30% more money" (from the [startup genome project](https://s3.amazonaws.com/startupcompass-public/StartupGenomeReport1_Why_Startups_Succeed_v2.pdf)).

### EBITDA
Earnings Before Interest, Taxes, Depreciation and Amortization. This should be the a measure of the health of a company's efficiency, as the measure of earnings is made net of purely financial aspects. Non GAAP measure, meaning it can be manipulated (read the fine prints!!).

###Non GAAP measures
(Not) Globally Accepted Accounting Principles measure. GAAP are measures that companies (and regulators, and stock exchange) accept as relevant on their financial statement. Non-GAAP are not *illegal*, but they are not as tightly defined and therefore not accepted by Stock Exchanges / Regulators (that are worth their salt). 

Non GAAP are actually pretty important for management reporting and as a reference point for investors. One important caveat: non GAAP less standardized, meaning comparing the same non GAAP measure across firms may be comparing apples to oranges (read the fine prints). One example of non GAAP measure is the EBITDA. 

## Some random concepts

### Land and expand
This is a sales concept, which boils down to first land a contract, of any size, with a customer. Then proceed to grow the account's top line (i.e. the revenue from that contract) by working with the customer,understanding the customer's requests and possibly educating him/her on the company's offer. In some organizations, different teams deal with the `land` and `expand` part. Another strategy can be to offer, in addition to the product, consulting for the product. That is one of the reasons why the sales-to-eng ratio is greater than one.

### Network effect
There are many definitions for this. The idea is to create a service/platform/service that attract users "simply so they can interact with the existing users" (attributed to Zuck, from this [article](https://www.wired.com/2012/05/network-effects-and-global-domination-the-facebook-strategy/)). Examples are the telephone, FB, but as well as MS Office. Office position itself as the only way to open a spreadsheet, and you could/would not want to be out of that in a business environment.

This is one of the holy grail for businesses in general, and SAAS companies are no exception at all when they structure their product. A great Network Effect means lots more leeway in the product development. Meaning, the product can be real bad, and you'll still use it (Craigslist, anyone?).

### Virality
Not to be confused or conflated with `Network effect`, this simply means that the adoption increases with more adoption. E.g. `fidget spinner` I get one because everyone else has one, but the fact that everyone else gets one does not make that more valuable to me.

### Ecosystem
Think about iPhone App store OR Android Play. Turning the service into a platform / an ecosystem. One effect of the attempt of generating a richer ecosystem to entice users not to leave is, for example, the push by MS these days (2017) to open Azure to other technologies (Linux, as one example). 

Another coveted aspect for SAAS companies, as it keeps users to churn out + keeps developers adding valuable parts. Apple did not get it right for the iPad, as [Ben Thompson](https://stratechery.com/2015/from-products-to-platforms/) summarized very well.

### How much would my stocks be worth today?
The question you should ask when offered stock options.

### Marketing
It is not the promotion, it is not the PR, it's not the packaging. It encompasses A LOT of activities, from product, to price, to promotion, to place (yeah, the 4p). To physical evidence, to process, to people (yeah, the extended 7 ps). Getting it right is key, and most engineers (comprising me at the beginning of my career) underestimates this aspect. One bad sign? If a company that keeps changing CMOs (Chief Marketing Officers) it may be a sign of confused ideas over what their *raison d'etre* actually is.