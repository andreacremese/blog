---
title: "RabbitMQ basics"
date: 2015-02-09 15:31
comments: true
tags:
	- SOA 
---

The path for all the knowledge and wisdom in the universe is a very windy way, and it is letting me pass through Service Oriented Architecture. I am actualy quite glad of that =).

Among the various services, platforms and tools I have studied in order to implement SOA for one of our clients there is RabbitMQ, the implementation of a memory queue by Pivotal Lab. Immagine and angry version of MSMQ, on steroids.

I approached RabbitMQ right after having tried Azure service Bus Queues, which provide a lot of behavior as a service. RabbitMQ requires a bit more coding but its implementation is pretty cool, plus exposes the rabbitMQ server - which allows to drill into the nitty gritty of the host in a browser.

## RabbitMQ (site) tutorials

These [folders on github](https://github.com/AndreaHK5/RabbitMqTutorials) contain the examples / tutorials for Rabbit MQ (refer to [their site](http://www.rabbitmq.com/tutorials/tutorial-one-dotnet.html) for architecture and more documentation). Some comments are added - mainly for my personal benefit and future reference. All solutions run locally and in some cases the behavior might have been slightly modified from the one proposed in the Pivotal examples.

I also added an extra folder with an exercise that mixes many aspects of SOA in RabbitMQ:

* Topics (implemented as exchanges in the RabbitMQ world).
* Binding the routing keys (note that Binding for RabbitMQ means something completely different than in the MS - WCF world).
* Use of "acknowledgments" receipts for "at-most-once" messaging.
* Durable queues (locally, but still resilient to shut down of the consumer).
* Name queues in lieu of self naming queues (used in the exchange samples). These allow the queue to be durable in case of crash for the subscriber.
* Pub/subs.
* Enforced round robin depending on the dimension of the messages rather than just on the order of arrival (which is the standard).


## On routing keys
Refer to RabbitMQ's site section at this [link](https://www.rabbitmq.com/tutorials/tutorial-five-dotnet.html).

## How to run the exercise
Compile the solution in the binaries.

Make sure you have Erlang and RabbitMQ installed up and running - check [localhost:15672](localhost:15672) if in doubt).

All commands are run via powershell / prompt (as in the examples in the Rabbit MQ site).
### Register the consumers
Register the listeners to create and bind the queues. Note that this implementation includes Feeds, but not Seed yet (old messages)
	
	\Rabbit.Receiver\bin\Debug> Rabbit.Receiver.exe alert.high alert.mid

And state the name of the queue for this listener (this is in case the listener crashes and you want to pick it up later).

	Enter queue name (RabbitMQ will create if does not exist)
	Alert1


The queue Alert1 will be bound to the routing keys

	subscribed to queue Alert1
	Alert1 now bound to alert.high
	Alert1 now bound to alert.mid
	consumer up and running, waiting for messages

Now the queue Alert2 will subscribe to all alerts (in another shell):

	\Rabbit.Receiver\bin\Debug>Rabbit.Receiver.exe alert.*
	Enter queue name (RabbitMQ will create if does not exist)
	Alert2
	subscribed to queue Alert2
	Alert2 now bound to alert.*
	consumer up and running, waiting for messages

### Send messages

So now we send some messages to have a look. At first a specific message:

	\Rabbit.Sender\bin\Debug>Rabbit.Sender.exe alert.mid
	sent message Message : alert.mid


Listener Alert1 will receive:

	//Alert1
	consumer up and running, waiting for messages
	Received message Message : alert.mid

And so will Alert2:

	//Alert2
	consumer up and running, waiting for messages
	Received message Message : alert.mid


We will now send a low alert. If everything is as it should be, Alert1 will not see it at all, but Alert 2 will.

### Persistance

Try to kill one of the consumers, send a few messages and then restart the listeners. =)


### Contrast with Azure Service Bus Queues and other thoughts
These basic examples for RabbitMQ implement two main roles: **sender** and **receiver**. As a result, there is a tighter than necessary dependence between the two. For example, the listeners (and their bindings) need to be instantiated before the sender.

Future iteration will remove this constraint. Interesting to note that, out of the box, a competing service like Azure Service Bus Queues (AZSBQ) proposes a third role, directly embedded in the API, that of the **manager**. AZSBQ sender and receiver roles are typically not granted permission to instantiate queues, and manager is a separate app all together. 

Instead NServiceBus (at least in the first tutorials) delegates the instantiation of the queue to the consumer too.	 

