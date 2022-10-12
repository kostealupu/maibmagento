<?php
namespace Dfe\TBCBank\Cron;
use Df\API\Operation;
use Dfe\TBCBank\API\Facade as F;
use Dfe\TBCBank\W\Event as Ev;
use Zend_Http_Client as Z;
use Psr\Log\LoggerInterface;

class Close {
    protected $logger;

    public function __construct(LoggerInterface $logger) {
        $this->logger = $logger;
    }

   /**
    * Write to system.log
    *
    * @return void
    */
      public function execute() {
    $this->logger->info('Cron Close Day ok!'); 
       return F::s()->post([
		'command' => 'b'
	]);
        
                              
      } 
}