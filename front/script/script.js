
const mainContainer = $('#main');
var allAlylists = [];
var tracks;
var trackIndex = 0;
var isPlating = false;
var canAppendAnotherFileToUplode = true;
const playlistTemplate = $.trim($('#hidden-template-playlist').html());
const addPlaylistTemplate = $.trim($('#hidden-template-form-add-playlist').html());
const playerTemp = $.trim($('#hidden-template-player').html());

$(function(){
    //on loade print all the playlists
    getAllPlaylists(function(data){
        if(data !== "no playlists"){
            $('#playlist-section').empty();
            data = JSON.parse(data);
            $.each(data,function(i , val){
                let PL = new Playlist(val.Id,val.Name,val.Img_path);
                PL.PrintIcone();
                PL.Edit();
                PL.Printplayer();
                PL.Delete();
                allAlylists.push(PL);
            }); 
        }
    });
        
    //******new playlist (and trcks)*******
    $('#add_playlist_button').click(function(){
        addNewPlaylist();
    });
    //******serch*****
    $('#serch_text').keyup(function(){
        serchForPlaylist($('#serch_text').val());
    });
    $('#serch_text').focus(function(){
        $('#serchResalt').show();
    });
    
    
});

function Playlist(id,name,img){

    this.Id = id;
    this.Name = name;
    this.Img_path = img;

    this.PrintIcone = () => {
        //get the templat from the html, replace and append
        let template = playlistTemplate
        .replace(/{Name}/ig, this.Name)
        .replace(/{Id}/ig, this.Id)
        .replace(/{Img_path}/ig, this.Img_path);
        $('#playlist-section').append(template);
        $('#playlist_container-'+this.Id).draggable();
        //circle text
        new CircleType(document.getElementById('name' + this.Id)).radius(130);

    }
    this.Printplayer = () =>{
        // onClickPrintplayer();
        $('#playlist-' + this.Id).click(function(){
            let playlist_id = $(this).attr('id').match(/\d+/)[0];
            let playlistName = $('#name' + playlist_id).text();
            let Img_path = $(this).css('background-image');
            trackIndex = 0;
            //ajax function to get the tracks in the playlist
            get_playlist_tracks(playlist_id,function(data){
                tracks = JSON.parse(data);
                //send to print
                print_player(playlistName,Img_path,tracks);  
                $('title').text(tracks[trackIndex].Name);
                if(tracks !== 'no tracks'){
                    $('#nowPlaying').text(" " + tracks[trackIndex].Name);
                }else{
                     $('#nowPlaying').text('no tracks');
                }
                
                //close
                $('.glyphicon-remove').click(function(){
                    $('#playing').remove(); 
                }); 
                //play/pause when clicking th B.G image
                $('#bg_img').click(function(){
                    var audio = document.querySelector("audio");
                    if(isPlating){
                        audio.pause();
                    }else{
                        audio.play();
                    }
                   
                });
            });   
        });  
    }
    this.Edit = () =>{
        let id = this.Id;
        let playlistName = this.Name;
        let playlistBgImg = this.Img_path;

        $('#edit-' + this.Id).click(function(){
            //switch between the forms, and append the edit
            $('#add_playlist_form').remove();
            mainContainer.append(addPlaylistTemplate);
            $('#add_playlist_form').draggable();
            //get all tracks
            get_All_tracks(function(data){
                //print all tracks open
                $('#track_list').css('display', 'block');
                print_all_tracks(data); 

                //get playlist tracks 
                get_playlist_tracks(id,function(data){
                    tracks = JSON.parse(data);
                    //set 'checed' the tracks of the playlist
                    let allTrackList = $('#track_list').children();
                    for(let n = 0; n < tracks.length ; n++){
                        //start from 1 because not 0 base, it is an elemet list
                        for(let k = 1; k < allTrackList.length ; k++){
                            if(tracks[n].Id == allTrackList[k].id){
                                $(`#input-${tracks[n].Id}`).prop('checked', true);
                            }
                        }
                    }
                });
            }); 
            //add another track and appent the input
            $('#add_another_track').click(function(){
                if(canAppendAnotherFileToUplode){
                    $('#add_track').append(`<p>add track: <input type="file" name="files[]" onchange="fileIsReady()" class="add_track" accept="audio/*"> </p>`);
                    canAppendAnotherFileToUplode = false;
                }
            });
                 //close window
            $('#remove_form').click(function(){
                $('#add_playlist_form').remove();
            }); 
            // dont show close option
            $('#remove_track_list').css('display','none');
            //dont show track list button
            $('#track_list_button').css('display','none');
            //change 'add' to 'save'
            $('#addPlaylist').text('Edit Playlist');
            $('#submit').text('Save Changes');
            //set playlist name
            $('#playlistName').val(playlistName);
            //print img before uploading
            $("#fileToUpload").change(function() {
                readURL(this);
            });
            //onsubmit
            $('#uploade_form').submit(function(e){
                e.preventDefault();
                post_form($(this),id);
                $('#add_playlist_form').remove();
                
            }); 
        });
    }
    this.Delete = () =>{ 
        $('#delete-' + this.Id).click(function(){
            // let toDelete = confirm('to delete?');
            let id = $(this).attr('id').match(/\d+/)[0];
            //swweet alert
            swal({   title: "Your playlist will be deleted permanently!",   
            text: "Are you sure you want to delete the playlist?",   
            type: "warning",   
            showCancelButton: true,   
            confirmButtonColor: "#DD6B55",   
            confirmButtonText: "delete",   
            cancelButtonText: "cancel",   
            closeOnConfirm: true,   
            closeOnCancel: true }, 
            function(isConfirm){   
                if (isConfirm) {
                    
                    //if deletdt is playing so remove it
                    let playingName = $('#playing_name').text();
                    let toDeleteName = $('#name'+id).text();
                    if(playingName === toDeleteName){
                        $('#playing').remove();
                    }
                    // send to delet ajax function
                    deletePlaylist(id,function(data){
                        $(`#playlist_container-${id}`).remove();
                    });

                }        
            });        
        });
    }
}

function addNewPlaylist(){
    //append form
    mainContainer.append(addPlaylistTemplate);
    $('#add_playlist_form').draggable();
    //print img before uploading
    $("#fileToUpload").change(function() {
        readURL(this);
    });
    //close window
    $('#remove_form').click(function(){
        $('#add_playlist_form').remove();
    });
    //open list with all tracks
    $('#track_list_button').click(function(){
        if($('#track_list').css('display') === 'none'){
            $('#track_list').css('display', 'block');
            get_All_tracks(function(data){
                print_all_tracks(data); 
            });  
        }
        
    });

    //add another track and appent the input
    $('#add_another_track').click(function(){
        if(canAppendAnotherFileToUplode){
            $('#add_track').append(`<p>add track: <input type="file" name="files[]" onchange="fileIsReady()" class="add_track" accept="audio/*"> </p>`);
            canAppendAnotherFileToUplode = false;
        }
    });
    //send form
    $('#uploade_form').submit(function(e){
        e.preventDefault();
        post_form($(this)); 
    $('#add_playlist_form').remove();
    }); 
}
function print_all_tracks(data){
    data = JSON.parse(data);
    $('#track_list').empty();
    $.each(data,function(i , val){
        $('#track_list').append(`
        <p id="${val.Id}"><input type="checkbox" id="input-${val.Id}" value="${val.Id}" name="tracks[]"> ${val.Name}</p>
        `);
    });
}
function print_player(playlistName,Img_path,tracks){
    $('#playing').remove();
    //print the template
    let player = playerTemp.replace(/{playlistName}/ig, playlistName);
    $('#playing_now').append(player);
    //print track names in player
     if(tracks !== 'no tracks'){
        $.each(tracks,function(i , val){
            $('#ol_track').append(`<li class="appended_track_list" onclick="playMe(this)"id="${i}">${val.Name}</li>`);   
        });
        //  $('#playing').draggable();
    }

    //get playlist img
    $('#bg_img').css('background-image',Img_path);
    //start with the first track
    $('#path').attr('src', `../server/${tracks[0].Path}`);
    $('#nowPlaying').text(" " + tracks[trackIndex].Name);
}
//serch functions
function serchForPlaylist(text){
      $('#serchResalt').empty();
      if(text.length > 1){
        getSerchResalt(text, function(data){
            if(data !== 'no playlist'){
                let serchResalt = JSON.parse(data);
                appendSerchResalt(serchResalt);
            }else{
                appendSerchResalt('no playlist');
            }  
        });
    }    
}
function appendSerchResalt(serchResalt){
    //print results
    if(serchResalt !== 'no playlist'){
        $('#serchResalt').empty();
        $.each(serchResalt,function(i , val){
            $('#serchResalt').append(`<p id="${val.Id}" class="serchResaltItem"><img class="smallImg" src="../server/${val.Img_path}"> ${val.Name}</p>`)
        });
            //click on serch item
        $('.serchResaltItem').click(function(){
            $('#playing').remove(); 
            let playlist_id = $(this).attr('id');
            let playlistName = $(this).text();
            let Img_path = $(this).children('.smallImg').attr('src');
            Img_path = `url(${Img_path})`;
            get_playlist_tracks(playlist_id,function(data){
                tracks = JSON.parse(data);
                //send to print for the main player
                print_player(playlistName,Img_path,tracks);
                $('.glyphicon-remove').click(function(){
                    $('#playing').remove(); 
                });
            });       
        });
    }
    else if(serchResalt === 'no playlist'){
        $('#serchResalt').empty();
        $('#serchResalt').append(`<p class="serchResaltItem"> ${serchResalt}</p>`);
    }
}

//audio
function next_track(){
    //if
    (trackIndex < tracks.length-1 ? trackIndex ++ : trackIndex = 0 )
    var audio = document.querySelector("audio");
    audio.src = `../server/${tracks[trackIndex].Path}`;
    //set the track that is playing
    $('#nowPlaying').text(" " + tracks[trackIndex].Name);
    $('title').text(tracks[trackIndex].Name);  
}
function playMe(li){
    trackIndex = li.id;
    var audio = document.querySelector("audio");
    audio.src = `../server/${tracks[trackIndex].Path}`;
    //set the track that is playing
    $('#nowPlaying').text(" " + tracks[trackIndex].Name);
    $('title').text(tracks[trackIndex].Name);
}
function onPause(){
    isPlating = false;
    $('#bg_img').removeClass('spin');
    $('#glyphiconPlayPause').removeClass('glyphicon glyphicon-pause')
    $('#glyphiconPlayPause').addClass('glyphicon glyphicon-play-circle')
}
function onPlay(){
     isPlating = true;
     $('#bg_img').addClass('spin');
     $('#glyphiconPlayPause').removeClass('glyphicon glyphicon-play-circle')
     $('#glyphiconPlayPause').addClass('glyphicon glyphicon-pause')
}

//ajax get request functions
function getAllPlaylists(callback){
    // clearContainer();
     $.ajax({
        url: 'http://localhost/playlist/server/api.php?action=main',
        method: "get",
        success: function (data, success, reponse) {             
             callback(data);  
        },
        error: function (data, error, reponse) {
            console.log("request error");
        }
    })
}
function get_All_tracks(callback){
     $.ajax({
        url: 'http://localhost/playlist/server/api.php?action=get_all_tracks',
        method: "get",
        success: function (data, success, reponse) {             
             callback(data);  
        },
        error: function (data, error, reponse) {
            console.log("request error");
        }
    })
}
function get_playlist_tracks(id,callback){
     $.ajax({
        url: 'http://localhost/playlist/server/api.php?id='+id,
        method: "get",
        success: function (data, success, reponse) {             
             callback(data);  
        },
        error: function (data, error, reponse) {
            console.log("request error");
        }
    })
}
function getSerchResalt(serchText,callback){
    $.ajax({
        url: 'http://localhost/playlist/server/api.php?serch=' + serchText,
        method: "get",
        success: function (data, success, reponse) {             
             callback(data);  
        },
        error: function (data, error, reponse) {
            console.log("request error");
        }
    })
}
function deletePlaylist(id,callback){
     $.ajax({
        url: 'http://localhost/playlist/server/api.php?delete=' + id,
        method: "get",
        success: function (data, success, reponse) {             
             callback(data);  
        },
        error: function (data, error, reponse) {
            console.log("request error");
        }
    })
}
function post_form(data, EditId = -1){
    var formData = new FormData(data[0]);
    if(formData){
        formData.append('editId',EditId);
        $.ajax({
            url : 'http://localhost/playlist/server/api.php',
            method : 'POST',
            data : formData,
            cache: false,
            processData: false,  // tell jQuery not to process the data
            contentType: false,  // tell jQuery not to set contentType
            success : function(data) {
                if(data !== 'eror'){
                    let fromEdit = false;
                    data = JSON.parse(data);
                    //check if this was called from edit or add
                    for (let i = 0; i < allAlylists.length; i++) {
                        if(allAlylists[i].Id === data[0].Id){
                            fromEdit = true;
                            allAlylists.splice(i,1);
                            $('#playlist_container-' + data[0].Id).remove();
                            let PL = new Playlist(data[0].Id,data[0].Name,data[0].Img_path);
                            PL.PrintIcone();
                            PL.Delete();
                            PL.Edit();
                            PL.Printplayer();
                            allAlylists.push(PL);
                            $('#playlist-'+ data[0].Id).trigger('click');
                        }
                    }
                            //add instance
                    if(!fromEdit){
                        let PL = new Playlist(data[0].Id,data[0].Name,data[0].Img_path);
                        PL.PrintIcone();
                        PL.Delete();
                        PL.Edit();
                        PL.Printplayer();
                        $('#playlist-'+ PL.Id).trigger('click');
                    }  
                }else{
                   console.log("error"); 
                }
            },
            error: function (data, error, reponse) {
                console.log("request error");
            }
        });
    }
}

// file reader
 function readURL(input) {
    if (input.files && input.files[0]) {
        $('#image').css('display', 'block');
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#image').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
function fileIsReady(){
    canAppendAnotherFileToUplode = true;
}

