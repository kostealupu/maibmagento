define([
	'df', 'df-lodash', 'Df_Checkout/api', 'Df_Core/my/redirectWithPost'
	,'Df_StripeClone/main', 'jquery', 'ko'
	,'Magento_Checkout/js/model/quote'
	,'Magento_Customer/js/model/customer'
	,'Magento_Checkout/js/model/url-builder'
], function(df, _, api, rPost, parent, $, ko, q, customer, ub) {'use strict';
return parent.extend({
getCardTypes: function() {return null;},
	tokenCheckStatus: function(status) {return status;},
	tokenCreate: function(params, callback) {
		/** @type {Boolean} */ var l = customer.isLoggedIn();
		$.when(api(this,
			ub.createUrl(df.s.t('/dfe-tbc-bank/%s/id', l ? 'mine' : q.getQuoteId()), {})
			,_.assign({ba: q.billingAddress(), qp: this.getData()}, l ? {} : {email: q.guestEmail})
		))
			.fail(function() {debugger; callback(false, null);})
			.done($.proxy(function(json) {
				callback(true, $.parseJSON(json));
			}, this))
		;
	},
	tokenErrorMessage: function(status, resp) {return this.$t(
		'The payment attempt is failed. Please contact us by phone.'
	);},
tokenFromResponse: function(resp) {return resp.id;},
  
placeOrder: function(_this, event) {
			this.state_waitingForServerResponse(true);
			if (!this.isNewCardChosen()) {
				this.token = this.currentCard();
				this.placeOrderInternal();
			}
			else {
              
				this.tokenCreate(this.tokenParams(), $.proxy(function(status, resp) {
					if (!this.tokenCheckStatus(status)) {
						this.showErrorMessage(this.tokenErrorMessage(status, resp));
						this.state_waitingForServerResponse(false);
					}
					else {
					this.token = this.tokenFromResponse(resp);
					let tokene = this.token;
					this.tokenResp = resp;
	 			this.isPlaceOrderActionAllowed(false);
	 				this.getPlaceOrderDeferredObject()
	 				.fail(function() {self.isPlaceOrderActionAllowed(true);})
	 				.done(function() {
	 	    rPost('https://maib.ecommerce.md:21443/ecomm/ClientHandler', {
			trans_id: tokene
		    })
	 			});
	 			return true;
               
					}
				}, this));
			}
	},
});});
