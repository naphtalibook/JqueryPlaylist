<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');





 //go to db and echo a file with all playlists (whith out the tracks)
if (isset($_GET["action"]) && $_GET["action"] === 'main'){
    require_once 'controller/get_controller.php';
    $controller = new GetController();
    $playlists = $controller->get_all_playlists();

    // echo json_encode($playlists);
}
if(isset($_GET['action']) && $_GET['action'] === 'get_all_tracks' ){
    //get all tracs list
    require_once 'controller/get_controller.php';
    $controller = new GetController();
    $controller->get_all_tracks();
}
if(isset($_GET['id']) ){
    //get all tracs of the playlist id
     require_once 'controller/get_controller.php';
     $controller = new GetController();
     $controller->get_playlist_tracks($_GET['id']);
}
if(isset($_GET['serch']) && $_GET['serch'] !== ""){
    // serch for playlist name
    require_once 'controller/get_controller.php';
    $controller = new GetController();
    $controller->serch_playlist($_GET['serch']);
}

if(isset($_GET['delete']) && $_GET['delete'] !== ""){
    // delete the play list
    require_once 'controller/get_controller.php';
    $controller = new GetController();
    $controller->delete_playlist($_GET['delete']);
}


//edit
if(isset($_POST['editId']) && $_POST['editId'] > 0){
    require_once 'controller/playlist_controller.php';
    $controller = new PlaylistController();
    $id = $_POST['editId'];
    $playlist_name = htmlspecialchars($_POST['playlist_name']);
    // get image
    if(isset($_FILES['files']['name'][0]) && $_FILES['files']['name'][0] !== ""){
         $img_path = 'uploads/'.$_FILES['files']['name'][0];
    }else{
        $img_path = $controller->get_img($id);
    }
    //send to DB
    $resalt = $controller->edit_playlist($id,$playlist_name,$img_path);
    if($resalt){

        ///delete all old tracs
        $controller->delete_old_tracs($id);

        //add track
        if(isset($_FILES['files']) || count($_FILES['files']['name']) > 0 || isset($_POST['tracks'])){
            $track_ids = $controller->add_playlist_tracks();
            // get tracks from checkbox
            if(isset($_POST['tracks']) && count($_POST['tracks']) > 0 ){   // ||
                //add checked tracks to tracs that where upload
                foreach($_POST['tracks'] as $item){
                    if(isset($track_ids)){
                        $test = array_search($item,$track_ids);
                        if($test === false){
                            $track_ids[] = $item;
                        }
                    }else{
                         $track_ids[] = $item;
                    }
                   
                }
            }
            //attach track to playlist
            if(isset($track_ids)){
                 $resalt = $controller->attach_track_to_playlist($id,$track_ids);
            }
            require_once 'model/playlist.php';
            //create new object to send
            $arr[] = new Playlist($id,$playlist_name,$img_path);
            echo json_encode($arr);
        }
    }else{
        echo 'eror';
    }   
}

//case new playlist
else if(isset($_POST['playlist_name']) && count($_POST['playlist_name']) > 0 ){ 
    //add playlist
    require_once 'controller/playlist_controller.php';
    $playlist_name = htmlspecialchars($_POST['playlist_name']);
    $controller = new PlaylistController();
    $playlist_id = $controller->add_playlist($playlist_name);

    if($playlist_id){
  
        //add track
        if(isset($_FILES['files']) || count($_FILES['files']['name']) > 0 || isset($_POST['tracks'])){
            $track_ids = $controller->add_playlist_tracks();
            // get tracks from checkbox
            if(isset($_POST['tracks']) && count($_POST['tracks']) > 0 ){ // ||
                //add chect tracks to tracs that where upload
                  foreach($_POST['tracks'] as $item){
                    if(isset($track_ids)){
                        $test = array_search($item,$track_ids);
                        if($test === false){
                            $track_ids[] = $item;
                        }
                    }else{
                         $track_ids[] = $item;
                    }
                   
                }
            }
            //attach track to playlist
            $resalt = $controller->attach_track_to_playlist($playlist_id,$track_ids);
            require_once 'model/playlist.php';
            if($_POST['playlist_name'] === ''){
                $playlist_name = 'Playlist';
            }else {
                 $playlist_name = htmlspecialchars($_POST['playlist_name']);
            }
            if(empty($_FILES['files']['name'][0])){
                $img_path = 'uploads/d.jpg';
            }else{
                $img_path = 'uploads/'.$_FILES['files']['name'][0];
            }
            $arr[] = new Playlist($playlist_id,$playlist_name,$img_path);
            echo json_encode($arr);
        } else{ echo 'eror'; }
    }else{ echo 'eror'; }
}





?>