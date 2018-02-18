<?php

class Playlist{

      public $Id;
      public $Name;
      public $Img_path;

     public function __construct(){

            if(func_num_args() > 0 ){
                $this->Id = func_get_arg(0);
                $this->Name = func_get_arg(1);
                $this->Img_path = func_get_arg(2); 
            }
      }
      
}