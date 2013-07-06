$(function() {
    SC.initialize({
        client_id: '4e02febf3f486eb62dcc6adaf3934343'
    });	

    $song = $('.song').first();

    $('.song').on('click', function(e) {
        e.preventDefault();
        $song = $(this);
        var track_url = $song.attr('href');
        playSong(track_url);
    });

    function playSong(track_url) {
        var base_url = getBaseUrl(track_url);
        if (base_url  === 'soundcloud.com') {
            playSoundCloud(track_url);
        } 
        else if (base_url === 'www.youtube.com') {
            var video_id = track_url.split('v=')[1];
            var ampersandPosition = video_id.indexOf('&');
            if(ampersandPosition != -1) {
                video_id = video_id.substring(0, ampersandPosition);
            }
            //var iFrame = '<iframe id="ytplayer" type="text/html" width="600" height="360" src="https://www.youtube.com/embed/' + video_id + '?autoplay=1&enablejsapi=1" frameborder="0" allowfullscreen>';
            //$('#track').html(iFrame);
            $('#track').html('');
            $('#track').append('<div id="player"></div>');
            var player;
            player = new YT.Player('player', {
                height: '390',
                width: '600',
                videoId: video_id,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }
    }

    function playSoundCloud(url) {
        SC.oEmbed(url, { auto_play: true }, function(oEmbed) {
            $('#track').html(oEmbed.html);
            var iframeElement = document.querySelector('iframe');
            var widget = SC.Widget(iframeElement);
            widget.bind(SC.Widget.Events.FINISH, function() {
                nextSong = $song.parent().parent().next().find('.song');
                $song = nextSong;
                nextUrl = nextSong.attr('href');
                playSong(nextUrl);
            });
        });
    }

    function getBaseUrl(url) {
        return url.replace(/.*?:\/\//g, '').split('/')[0];
    }


    //Youtube Player Callbacks

    function onPlayerReady(event) {
        event.target.playVideo();
    }

    function onPlayerStateChange(event) {        
        if(event.data === 0) {            
            nextSong = $song.parent().parent().next().find('.song');
            $song = nextSong;
            nextUrl = nextSong.attr('href');
            playSong(nextUrl);
        }
    }
});
