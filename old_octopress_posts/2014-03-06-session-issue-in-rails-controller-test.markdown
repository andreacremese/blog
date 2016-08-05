---
layout: post
title: "session issue in rails controller test"
date: 2014-03-06 00:13
comments: true
categories: 
---
<p>A quick post as I am trying to:</p>
<ul>
<li>1) Catch up on sleep.</li>
<li>2) Enjoy my new laptop machine (coding on a 2009 white unibody with an Italian keyboard was fun for a while, but now it is really time to step up my game.</li>
</ul>
<p>This evening, while chewing through AWDR4 (link) I had an issue with the controller test. Here is the relevant code:</p>

<p>Controller:</p>
<pre>
<code>
class LineItemsController < ApplicationController
  include CurrentCart
  before_action :set_cart, only: [:create, :destroy]
  ...
  def destroy
    @line_item.destroy
    respond_to do |format|
      format.html { redirect_to @cart }
      format.json { head :no_content }
    end

  end
  </code>
</pre>
<p>CurrentCart:</p>
<pre>
<code>
module CurrentCart
  extend ActiveSupport::Concern
  
  private
  # how to make sure the session is able to follow the session. and the other way around too 
  def set_cart
    @cart = Cart.find(session[:cart_id])
  rescue ActiveRecord::RecordNotFound
    @cart = Cart.create
    session[:cart_id] = @cart.id
  end
end
  </code>
</pre>
<p>Test:</p>
<pre>
<code>
class LineItemsControllerTest < ActionController::TestCase
  setup do
    @line_item = line_items(:one)
  end
  ...
  test "should destroy line_item" do
    assert_difference('LineItem.count', -1) do
      delete :destroy, id: @line_item
    end

    assert_redirected_to @cart
  end
end
  </code>
</pre>
<p>In brief: I am deleting a line item form a cart, and then want to make sure I redirect to the cart.
The error that was instead given is below:</p>
<pre>
  <code>
LineItemsControllerTest#test_should_destroy_line_item [/Users/Andrea/code/depot/test/controllers/line_items_controller_test.rb:47]:

Expected response to be a redirect to <http://test.host/line_items> but was a redirect to <http://test.host/carts/980190963>.

<strong>Expected "http://test.host/line_items/980190962" to be === "http://test.host/carts/980190963".</strong>
</code>
</pre>
<p>It is evident that somehow the destroy action makes the cart to disappear, and as a result the before_filter method causes a new cart to be created.</p>
<p>After trying different things with no success (e.g. saving the cart in a local variable, using the line item and trying @line_item.cart), I decided to look into the session, and gather the cart I get form the session. therefore the working test was:</p>
<pre>
  <code>
  test "should destroy line_item" do
    assert_difference('LineItem.count', -1) do
      delete :destroy, id: @line_item
    end
    assert_redirected_to <strong>cart_path(session[:cart_id])</strong>
  end
  </code>
</pre>
<p>Noting gathering the cart form the session hash.</p>