INTRODUCTION
------------
The module integrates a Magento 2 based webstore with **maib** (Moldova).

REQUIREMENTS
------------
Magento 2 (Composer v.2)

INSTALLATION
------------
```
bin/magento maintenance:enable
rm -f composer.lock
composer clear-cache
composer require kostealupu/maibmagento:*
bin/magento setup:upgrade
bin/magento cache:enable
rm -rf var/di var/generation generated/code
bin/magento setup:di:compile
rm -rf pub/static/*
bin/magento setup:static-content:deploy -f en_US <additional locales, e.g.: ro_RO>
bin/magento maintenance:disable
```
CONFIGURATION
-------------
Stores > Configuration > MAIB > Payment
