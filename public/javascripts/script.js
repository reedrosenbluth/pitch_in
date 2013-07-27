$(function() {
    SC.initialize({
        client_id: '4e02febf3f486eb62dcc6adaf3934343'
    });	

    var $song = $('.song').first();
    var hidden = false;

    $('.song').on('click', function(e) {
        console.log('here');
        $song = $(this);
        var track_url = $song.attr('href');
        playSong(track_url);
    });

    $('.toggle').hide();

    $('.toggle').on('click', function() {
        if (!hidden) {
            $('#player').animate({
                'margin-left':'+=' + 600
            }, 200);
            hidden = true;
        } else {
            $('#player').animate({
                'margin-left':'-=' + 600
            }, 200);
            hidden = false;
        }
    });

    function playSong(track_url) {
        $('.toggle').show();
        $('.song').removeClass('active');
        $song.addClass('active');
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
            $('#player').html('');
            $('#player').append('<div id="yt"></div>');
            var player;
            player = new YT.Player('yt', {
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
            $('#player').html(oEmbed.html);
            var iframeElement = document.querySelector('iframe');
            var widget = SC.Widget(iframeElement);
            widget.bind(SC.Widget.Events.FINISH, function() {
                nextSong = $song.next();
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
            nextSong = $song.next();
            $song = nextSong;
            nextUrl = nextSong.attr('href');
            playSong(nextUrl);
        }
    }
});
