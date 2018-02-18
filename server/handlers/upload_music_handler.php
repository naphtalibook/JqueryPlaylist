<?php

class Upload_music{

    public static function upload(){
        if(isset($_FILES["files"]["name"])){
            for ($i=0; $i < count($_FILES["files"]["name"]); $i++) { 
                
                $target_dir = "uploads/";
                $target_file = $target_dir . basename($_FILES["files"]["name"][$i]);
                $uploadOk = 1;
                $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
            
                // Check file size
                if ($_FILES["files"]["size"][$i] > 100000000) {
                    continue;
                }
                // Allow certain file formats
                if($imageFileType != "mp3" && $imageFileType != "mp4" && $imageFileType != "wav" ){
                    continue;
                }
                // Check if $uploadOk is set to 0 by an error
                if ($uploadOk == 0) {
                // if everything is ok, try to upload file
                } else {
                    if (move_uploaded_file($_FILES["files"]["tmp_name"][$i], $target_file)) {
  
                    } else {
                    }
                }
                
                    $arr[] = $target_file;
            }
            if(isset($arr)){
              return  $arr; 
            }else{
                return false;
            }
            
        }
    }
}
?>