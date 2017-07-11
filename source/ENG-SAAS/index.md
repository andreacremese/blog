---
title: <ENG + SAAS>
date: 2017-06-13 18:01:50
---

# The SAAS cheatsheet for software engineers 

This is a mixin of terms and concepts for `Software Engineers` interested in `SAAS` business. These are some of the concepts I think are interesting & relevant as primer.

The page is under construction =). These notes are supposed to be helpful, not exhaustive. If you have any correction (or want to discuss any of the notes), please reach out!

## What's SAAS

Software As A Service, it is a software distribution model where the software is centrally held (hosted) and seats are sold. This is opposed to having a disk in a box (some vague memories fo that), aka Licensing Software. Basically, Office 365 is SAAS, versus Office installed on your machine is a Licensed software. 

SAAS is as well a model of revenue, as instead of a single transaction, it involves a subscription (monthly, annual,...) to which the user can opt in/out.

Thanks to the advancements in connection speed and browser technologies, it is now a lot easier to service customers with a SAAS product. I mean, imagine do that with Mosaic (no disrespect). 

## Metrics 

*handle them with extreme care* 

This section contains some of the key metrics to analyze a business with SAAS model. Metrics summarize a business' situation and that's what they are. They are (very useful) summaries, but they remain summaries. In many cases, looking only at metrics disregarding the story and the circumstances can lead to critical mistakes.

In addition, our brain constantly wants to use shortcuts (any Kahneman and Tversky 's fan?) or approximate system behaviors to straight lines (which in many cases, [just wrong]([https://hbr.org/2017/05/linear-thinking-in-a-nonlinear-world]).

All this to reinforce: user metrics with care!

### GAAP measures
Globally Accepted Accounting Principles measure (GAAP) are measures that companies (and regulators, and stock exchange) accept as relevant on their financial statement or S1 (the official document that in the States introduces an IPO). Non-GAAP are measures that do not comply with these requirements. These are not *illegal*, but they are not as tightly defined and therefore not accepted by Stock Exchanges / Regulators. 

Non GAAP are actually pretty important for management reporting and as a reference point for investors. One important caveat: non-GAAP are less standardized, meaning comparing the same non-GAAP measure across firms may be comparing apples to oranges (read the fine prints). 

Most of the metrics in this page are non-GAAP.

### ARR

In SAAS companies, ARR is usually the `Annual Recurring Revenue`. It is calculated by taking the total of subscription contracts that have been closed and divided for the length of said contracts (expressed in years). This is a measure of the projected income from signed up subscription per year. Note that subscriptions that can be cancelled monthly do not contribute to the ARR, but a year commitment that is paid monthly does contribute to the ARR. For this reason, sometimes businesses report their `MRR`, which is the same measure, on a monthly basis for extra granularity.

ARR is sometimes computed for certain classes of customers, e.g. ARR (MRR) for new customers, recurring, churned. 

Note that in business analysis ARR can as well be `Accounting rate of return`: a measure to assess the variation in the value of an asset on a year basis. Meaning ARR = (value_@_end - value_@_beginning) / value_@_beginning. For a firm, this can be computed using its total capitalization OR just using the profits (losses) and the capitalization at beginning of the year.

### CAC
Customer acquisition cost - basically how many dollars does it cost to get one extra paying customer through the marketing funnel. **Needs to be smaller than Life Time Value, otherwise the SAAS math do not works.**

### LTV (CLTV, LCV and various permutations)
(Customer's) Life Time Value  - how much revenue will the customer generate over its total lifetime (as a customer). **Needs to be greater than Customer acquisition cost, otherwise the SAAS math do not works.**

### Churn
This is one of the most important measures for a SAAS company. It is a measure of how many existing customers leave in a certain time period. Depending on the business model, healthy SAAS can have withstand churns of 10%, but please read on. 

Not all churns are made equal. Churn is physiological for SAAS, there is no way of getting rid of that, BUT the measure to really look at is the churn for **customer that are above a certain yearly billing a year** (e.g. 5k/10k). If that is in double digit, especially if the company has a high price point and lower number of customers, start asking more questions.

### Users VS Customers
Startup tend to report users, but be extra careful as users may be <> customers. In many cases in a SAAS model, a **customer** has multiple seats. 

User count is very useful to understand the size of the operations and the potential network effect, but to gauge the financials of a company, ask for (paying) customers. 

### Run Rate
Pro rata the income of a single period (say, a quarter) to a year. This is a measure of a business top line that presumes no growth (or decline, for that matter) as it takes current performance and projects that as the bases for the full year. Handle with care: imagine taking the sales on black friday and project to the full year...

### Burn rate
Loss per month. How much it is spent per month above the revenue (in a startup and during launch, cost of good sold will inevitably be smaller than the revenue, hence this is likely to be a loss). From this you get the concept of runway. This is the amount of time a startup can remain a going concern assuming the current burn rate is constant. 

### Runway
This is the amount of time a company can remain a going concern assuming the current burn rate / run rate is constant.

### Engineers to Salesman/Marketing ratio
Very very very crudely and depending on loads of factors, the ratio between salesman and engineers is usually somewhere in the 2:1 ballpark for SAAS (see [this analysis](http://tomtunguz.com/saas-spend-allocation-benchmarks/), for example). Meaning, two sales / marketing people for each engineer. Anyhow, the point is that sales and marketing is really important (not all engineers may appreciate this, especially at the beginning of their career). 

There is definitely more than this, but if here's another point: "Balanced teams with one technical founder and one business founder raise 30% more money" (from the [startup genome project](https://s3.amazonaws.com/startupcompass-public/StartupGenomeReport1_Why_Startups_Succeed_v2.pdf)).

### EBITDA
Earnings Before Interest, Taxes, Depreciation and Amortization. This should be the a measure of the health of a company's efficiency, as the measure of earnings is made net of purely financial aspects. Non GAAP measure, meaning it can be manipulated (read the fine prints!!). 

## Some additional concepts

### Network effect
There are many definitions of network effect. The idea is to create a service/platform/service that attract users "simply so they can interact with the existing users" (attributed to Zuck, from this [article](https://www.wired.com/2012/05/network-effects-and-global-domination-the-facebook-strategy/)). So the product becomes more valuable as people have it and use it.

Examples are the telephone, FB, but as well as MS Office. Office position itself as the only way to generate and open a spreadsheet, and one could/would not want to be out of that in a business environment.

This is one of the holy grail for SAAS businesses, and a great deal of thinking goes into incrementing the network effects while thinking about a product. A great Network Effect means lots more leeway in the product development. Meaning, the product can be real bad, and you'll still use it (e.g. Craigslist).

### Virality
Not to be confused or conflated with `Network effect`, this simply means that the adoption increases with more adoption. E.g. I may get a `fidget spinner` because everyone else has one, but the fact that everyone else gets one does not make the spinner more valuable to me.

### Ecosystem
Think about iPhone App store OR Android Play. Turning the service into a platform / an ecosystem. One effect of the attempt of generating a richer ecosystem to entice users not to leave is, for example, the push by MS these days (2017) to open Azure to other technologies (Linux, as one example). 

Another coveted aspect for SAAS companies, as it keeps users to churn out + keeps developers adding valuable parts. Apple did not get it right for the iPad, as [Ben Thompson](https://stratechery.com/2015/from-products-to-platforms/) summarized very well.

### Land and expand
This is a sales concept, which boils down to first land a contract, of any size, with a customer. Then proceed to grow the account's top line (i.e. the revenue from that contract) by working with the customer,understanding the customer's requests and possibly educating him/her on the company's offer. 

In some organizations, different teams deal with the `land` and with the `expand` part. In many cases SAAS companies tend to offer, in addition to the product, consulting on their own product. That is one of the reasons why the sales-to-eng ratio is greater than one.

### How much would my stocks be worth today?
The question you should ask when offered stock options.

### Marketing
It is not the promotion, it is not the PR, it's not the packaging. It encompasses A LOT of activities, from product, to price, to promotion, to place (yeah, the 4p). To physical evidence, to process, to people (yeah, the extended 7 ps). Getting it right is key, and most engineers (comprising me at the beginning of my career) underestimates this aspect. One bad sign? If a company that keeps changing CMOs (Chief Marketing Officers) it may be a sign of confused ideas over what their *raison d'etre* actually is.

ToDO:

* Read the CMO article in August HBR
* Convertible Note VS equity
* lift and shift
* customer success BD - SDR / CDM

