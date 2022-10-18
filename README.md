# MAIB payment method for Magento 2

Introduction
------------
The module integrates a Magento 2 based webstore with **maib**.

Requirements
------------
Magento 2 (Composer v.2)

Installation
------------
```
bin/magento maintenance:enable
composer clear-cache
composer require kostealupu/maibmagento:*
bin/magento setup:upgrade
rm -rf var/di var/generation generated/code
bin/magento setup:di:compile
rm -rf pub/static/*
bin/magento setup:static-content:deploy en_US <additional locales, e.g.: ro_RU>
bin/magento maintenance:disable
```
Before usage
-------------
To initiate a payment transaction you will need get the access by IP and set the return callback URL of your site at bank side.

Send email to **maib** ecommerce support (ecom@maib.md) and indicate your site external ***IP*** address and ***callback URL*** (https://yoursite.com/dfe-tbc-bank/).

Configuration
-------------
*Stores > Configuration > MAIB > Payment*

**Title**

Title displayed on the checkout screen.

**Certificate**

Paste the contents of your certificate (in the *.pem* format). For test mode: "***magento-0149583.pem***" from this repository. 
For live mode request certificate from <b>maib</b> ecommerce support. You will receive a certificate for live mode in *.pfx* format.

 Use openssl to convert certificate in *.pem* format from *.pfx* and password provided by bank:
 ```
 openssl pkcs12 -in certificate.pfx -out certificate.pem -nodes
 ```
**Password**

For test mode: "***Za86DuC$***". For live mode request password from **maib** ecommerce support.

**Payment Action**

* *Capture* (recomended) - Single Message System (SMS) Transaction. When the client's money transfers on the merchant account instantly when the user do the payment.

* *Authorize* - Dual Message System (DMS) Transaction. When the client's money has been blocked on their account and later merchant can confirm that transaction (in order invoice) to money transfer on the merchant account. 

***Authorize is not compatible with Apple Pay and Google Pay!***

**Description**

Transaction description displayed in the **maib** merchant interface.
```
{customer.name}	- Customer name
{order.id}	- Order increment ID
{order.items}	- Order items
{store.domain}	- Store domain name
{store.name}	- Store name
{store.url}	- Store URL
{current date}	- The current date. Use any expression supported by PHP `date()` function. Example: `{y-m}` => 16-01.
```
Live mode
-------------
After successful tests (transaction, reversal, close business day) you will receive a certificate, password and endpoints for live mode.

Actual endpoints for live mode:
* Merchant handler: https://maib.ecommerce.md:11440/ecomm01/MerchantHandler
* Client handler: https://maib.ecommerce.md:443/ecomm01/ClientHandler

Is mandatory to change test endpoints to live endpoints in module:
* Merchant handler: *maibmagento/API/Client.php* (line 54)
* Client handler: *maibmagento/view/frontend/web/main.js* (line 49)

And run commands:
```
bin/magento setup:upgrade
bin/magento setup:di:compile
bin/magento setup:static-content:deploy en_US <additional locales, e.g.: ro_RU>
```
Reversal transaction
--------------------
A reverse transaction is possible from the admin panel:

*Sale > Orders > View order > Invoices > View invoice > Credit memo > Refund*

Close bussines day
-------------------
Task for mandatory business day close is added in cron job (23:59): *maibmagento/etc/crontab.xml*

Magento Cron is required to be enabled!

Troubleshooting
---------------

All transactions are considered successful it's only if you receive a predictable response from the maib server in
the format you know. If you receive any other result (NO RESPONSE, Connection Refused, something else) there
is a problem. In this case it is necessary to collect all logs and sending them to **maib** by email: ecom@maib.md, in
order to provide operational support. The following information should be indicated in the letter:
- Merchant name
- Web site name
- Date and time of the transaction 
- Responses received from the server







