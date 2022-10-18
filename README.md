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

Paste the contents of your certificate (in the *.pem* format) here. For test: "**magento-0149583.pem**" from this repository. 
For live transactions request certificate from <b>maib</b> ecommerce support. You will receive a certificate for live transaction in *.pfx* format.

 Use openssl to convert certificate in *.pem* format from *.pfx* and password provided by bank:
 ```
 openssl pkcs12 -in certificate.pfx -out certificate.pem -nodes
 ```
**Password**

For test: "**Za86DuC$**". For live transactions request password from **maib** ecommerce support.
