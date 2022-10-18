# MAIB payment method for Magento 2

INTRODUCTION
------------
The module integrates a Magento 2 based webstore with **maib**.

REQUIREMENTS
------------
Magento 2 (Composer v.2)

INSTALLATION
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
BEFORE USAGE
-------------
To initiate a payment transaction you will need get the access by IP and set the return callback URL of your site at bank side.

Write an email to **maib** ecommerce support (ecom@maib.md) and indicate your site's external IP address and callback URL (https://yoursite.com/dfe-tbc-bank/).

CONFIGURATION
-------------
Stores > Configuration > MAIB > Payment

**Title**

Title to be shown on the checkout screen.

**Certificate**

Paste the contents of your certificate (in the *.pem* format). For test: "***magento-0149583.pem***" from this repository. 
For live transactions request certificate from <b>maib</b> ecommerce support. You will receive a certificate for live transaction in *.pfx* format.

 Use openssl to convert certificate in *.pem* format from *.pfx* and password provided by bank:
 ```
 openssl pkcs12 -in certificate.pfx -out certificate.pem -nodes
 ```
**Password**

For test: "***Za86DuC$***". For live transactions request password from **maib** ecommerce support.

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
