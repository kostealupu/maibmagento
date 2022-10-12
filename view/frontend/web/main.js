define([
	'df', 'df-lodash', 'Df_Checkout/api', 'Df_Core/my/redirectWithPost'
	,'Df_StripeClone/main', 'jquery', 'ko'
	,'Magento_Checkout/js/model/quote'
	,'Magento_Customer/js/model/customer'
	,'Magento_Checkout/js/model/url-builder'
], function(df, _, api, rPost, parent, $, ko, q, customer, ub) {'use strict';
/** 2017-09-06 @uses Class::extend() https://github.com/magento/magento2/blob/2.2.0-rc2.3/app/code/Magento/Ui/view/base/web/js/lib/core/class.js#L106-L140 */
return parent.extend({
	/**
	 * 2018-09-29 https://ecommerce.ufc.ge/ecomm2/images/ufc-utils_v2.js
	 * @override
	 * @see Df_Payment/main::getCardTypes()
	 * @used-by https://github.com/mage2pro/core/blob/3.9.12/Payment/view/frontend/web/template/card/fields.html#L4
	 * @returns {String[]}
	 */
getCardTypes: function() {return ['VI', 'MC'];},
 //getCardTypes: function() {return null;},
  
	/**
	 * 2018-09-29
	 * @override
	 * @see Df_Payment/mixin::placeOrderAfter()
	 * @used-by Df_Payment/mixin::placeOrderInternal()
	 */
	
    /**
	 * 2018-09-29
	 * @override
	 * @see Df_StripeClone/main::tokenCheckStatus()
	 * https://github.com/mage2pro/core/blob/2.7.9/StripeClone/view/frontend/web/main.js?ts=4#L8-L15
	 * @used-by Df_StripeClone/main::placeOrder()
	 * https://github.com/mage2pro/core/blob/2.7.9/StripeClone/view/frontend/web/main.js?ts=4#L75
	 * @param {Boolean} status
	 * @returns {Boolean}
	 */
	tokenCheckStatus: function(status) {return status;},
    /**
	 * 2018-09-29
	 * @override
	 * @see https://github.com/mage2pro/core/blob/2.0.11/StripeClone/view/frontend/web/main.js?ts=4#L21-L29
	 * @used-by Df_StripeClone/main::placeOrder()
	 * https://github.com/mage2pro/core/blob/2.7.9/StripeClone/view/frontend/web/main.js?ts=4#L73
	 * @param {Object} params
	 * @param {Function} callback
	 */
	tokenCreate: function(params, callback) {
		// 2017-04-04
		// The M2 client part does not notify the server part about the billing address change.
		// So we need to pass the chosen country ID to the server part.
		//console.log(newAddress.countryId);
		//_this.klHtml(newAddress.countryId);
		/** @type {Boolean} */ var l = customer.isLoggedIn();
		$.when(api(this,
			// 2017-04-05, 2018-09-28
			// q.getQuoteId() is a string like «63b25f081bfb8e4594725d8a58b012f7» for guests.
			ub.createUrl(df.s.t('/dfe-tbc-bank/%s/id', l ? 'mine' : q.getQuoteId()), {})
			,_.assign({ba: q.billingAddress(), qp: this.getData()}, l ? {} : {email: q.guestEmail})
		))
			.fail(function() {debugger; callback(false, null);})
			.done($.proxy(function(json) {
				callback(true, $.parseJSON(json));
			}, this))
		;
	},
    /**
	 * 2017-02-16
	 * https://www.omise.co/omise-js-api#createtoken(type,-object,-callback)
	 * @override
	 * @see https://github.com/mage2pro/core/blob/2.0.11/StripeClone/view/frontend/web/main.js?ts=4#L31-L39
	 * @used-by placeOrder()
	 * @param {Object|Number} status
	 * @param {Object} resp
	 * @returns {String}
	 */
	tokenErrorMessage: function(status, resp) {return this.$t(
		'The payment attempt is failed. Please contact us by phone.'
	);},
    /**
	 * 2018-09-29
	 * @override
	 * @see https://github.com/mage2pro/core/blob/2.0.11/StripeClone/view/frontend/web/main.js?ts=4#L41-L48
	 * @used-by placeOrder()
	 * @param {Object} resp
	 * @returns {String}
	 */
	tokenFromResponse: function(resp) {return resp.id;},
  
  
  placeOrder: function(_this, event) {
		
		/**
		 * 2017-07-27
		 * It looks like the standard jQuery form validation does not work for us
		 * because of the jQuery Validate plugin code:
		 *		.filter(function () {
		 *			if (!this.name && validator.settings.debug && window.console) {
		 *				console.error("%o has no name assigned", this);
		 *			}
		 *			// select only the first element for each name, and only those with rules specified
		 *			if (this.name in rulesCache || !validator.objectLength($(this).rules())) {
		 *				return false;
		 *			}
		 *			rulesCache[this.name] = true;
		 *			return true;
		 *		});
		 * https://github.com/magento/magento2/blob/2.2.0-RC1.5/lib/web/jquery/jquery.validate.js#L487-L499
		 * Stripe and its clones forbids us to assign the `name` attribute to the bank card form elements,
		 * and the jQuery Validate plugin acccounts the elements by their names,
		 * so it does not work for our bank card forms.
		 * 2017-07-28
		 * I have patched the jQuery Validate plugin here:
		 * https://github.com/mage2pro/core/blob/2.9.12/Core/view/base/web/main.js#L23-L72
		 */
		//if (this.validate()) {
			// 2017-07-26 «Sometimes getting duplicate orders in checkout»: https://mage2.pro/t/4217
			this.state_waitingForServerResponse(true);
			if (!this.isNewCardChosen()) {
				/**
				 * Идентификаторы карт начинаются с приставки «card_»
				 * (например: «card_18lGFRFzKb8aMux1Bmcjsa5L»),
				 * а идентификаторы токенов — с приставки «tok_»
				 * (например: «tok_18lWSWFzKb8aMux1viSqpL5X»),
				 * тем самым по приставке мы можем отличить карты от токенов,
				 * и поэтому для карт и токенов мы можем использовать одну и ту же переменную.
				 */
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
                      //console.log(this.tokenFromResponse(resp)); 
                       //console.log(resp); 
						//this.placeOrderInternal();

	
	 				this.isPlaceOrderActionAllowed(false);
	 				this.getPlaceOrderDeferredObject()
	 				.fail(function() {self.isPlaceOrderActionAllowed(true);})
	 				.done(function() {
	 					//self.afterPlaceOrder();
	 				//if (self.redirectAfterPlaceOrder) {
	 					//redirectOnSuccessAction.execute();
	 				//}

                     // console.log(tokene); 
	 	rPost('https://maib.ecommerce.md:21443/ecomm/ClientHandler', {
	
			trans_id: tokene
		
		})
 //window.location = 'https://maib.ecommerce.md:21443/ecomm/ClientHandler?trans_id=' + tokene;
	 			});
	 			return true;
               
					}
				}, this));
			}
		//}
	},
  //placeOrderAfter: function() {
     // rPost('https://maib.ecommerce.md:21443/ecomm/ClientHandler', {
	
			//trans_id: this.token
		
		//})
	//},
});});