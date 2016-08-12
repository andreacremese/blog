---
layout: post
title: "Methods in the model"
date: 2014-03-11 00:26
comments: true
categories: 
---
Brought to you by the "skinny controllers, fat models" pattern. Another reason to lump up logic in te models rather than in the controller. 

When writing an instance method in the model, you have automatic access to the associated models' methods.

So in the following example:

	class Order < ActiveRecord::Base
		has_many :line_items, dependent: :destroy
		[...]
		
		def add_line_items_from_cart(cart)
			cart.line_items.each do |item|
				item.cart_id = nil				
				line_items << item
			end
		end		
	end
	
Note the shoveling in the method, there is no need to call order.line_items, "line_items" suffices.

PS: I am aware of the multiple and very disturbing amount of typos in the previous posts. =( I will try to fix them (little by little).