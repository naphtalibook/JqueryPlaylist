<?php
require_once 'handlers/db_handler.php';

class PlaylistController
{
    public function add_playlist($playlist_name){
        require_once 'handlers/upload_img_handler.php'; 
        //upload the img of the playlist
       $target_file = Upload_Img::upload();
       if($target_file === 'uploads/' || $target_file == null){
            $target_file = 'uploads/d.jpg'; //defalt   
        }
        if($playlist_name === '' || $playlist_name === null){
            $playlist_name = 'playlist'; //defalt   
        }
        $id = Db_handler::add_playlist($playlist_name,$target_file);

        if($id){   
            return $id;
        }else{
            return false;
        }
    }
    public function add_playlist_tracks(){
       require_once 'handlers/upload_music_handler.php';  
       $target_file = Upload_music::upload();
       //send to db
        if($target_file){
            foreach ($target_file as $value) { 
                $name = basename($value);
                $name = basename($name, '.mp3');
                $id = Db_handler::add_track($name,$value);
                if(isset($ids)){
                    $test = array_search($id,$ids);
                    if($test === false){
                        $ids[] = $id;
                    }
                }else{
                    $ids[] = $id;
                }
                
            }
            return $ids; 
        }else{
            return null;
        }
    }

    public function attach_track_to_playlist($playlist_id,$track_ids){
        if(isset($track_ids)){
            foreach($track_ids as $track_id){
                $resalt = Db_handler::attach_track_to_playlist($playlist_id,$track_id);
            }
        }
       
    }
    


    public function edit_playlist($id,$playlist_name,$img_path){
        require_once 'handlers/upload_img_handler.php'; 
        //upload the img of the playlist
         $target_file = Upload_Img::upload();
        if($target_file === 'uploads/' || $target_file == null){
            $img_path = 'uploads/d.jpg'; //defalt   
        }
       
         $resalt = Db_handler::edit_playlist($id,$playlist_name,$img_path);
        if($resalt){
           return true;
        }else{
           return false;
        }
    }
    public function get_img($id_to_edit){
        $img =  Db_handler::get_img($id_to_edit);
        if($img){
            return $img;
        }else{
            return false;
        }
    }
    public function delete_old_tracs($id){
        $resalt = Db_handler::delete_playlist_tracks($id);
        if($resalt){
            return true;
        }else{
            return false;
        }
    }



}