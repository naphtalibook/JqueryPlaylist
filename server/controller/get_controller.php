<?php
require_once 'handlers/db_handler.php';
class GetController{
    
    public function get_all_playlists(){
        $playlists = Db_handler::get_all_playlists();
        if($playlists){
            echo json_encode($playlists);
        }else{
            echo "no playlists";
        } 
    }
    public function get_all_tracks(){
       $tracks = Db_handler::get_all_tracks();
       if($tracks){
            echo json_encode($tracks);
        }else{
            echo "no tracks";
        } 
    }
    public function get_playlist_tracks($playlist_id){
       $tracks = Db_handler::get_playlist_tracks($playlist_id);
       if($tracks){
            echo json_encode($tracks);
        }else{
            echo json_encode("no tracks");
        } 
    }


    public function serch_playlist($serchText){
         $playlist = Db_handler::serch_playlist($serchText);
         if($playlist){
            echo json_encode($playlist);
        }else{
            echo "no playlist";
        } 
    }
    public function delete_playlist($playlist_id){
        $resalt = Db_handler::delete_playlist_tracks($playlist_id);
        if($resalt){
            $resalt = Db_handler::delete_playlist($playlist_id);
        }
        if($resalt){
            echo 'was deleted';
        }else{
            echo 'problem with deleting';
        }
    }







}
?>