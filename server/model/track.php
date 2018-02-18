<?php

class Track{

      public $Id;
      public $Name;
      public $Path;

     public function __construct(){

            if(func_num_args() > 0 ){
                $this->Id = func_get_arg(0);
                $this->Name = func_get_arg(1);
                $this->Path = func_get_arg(2);
             
            }
      }
      
}