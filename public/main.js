

var main = function () {

  // Links to Server
  var rss_link = '/rss?link=';
  var search_link = '/search?term=';

  // Currently Selected Podcast
  var currentCast = {};

  var podcasts = {};

  var retrievedObj;
  if (retrievedObj = localStorage.getItem('podcasts')) {
    podcasts = JSON.parse(retrievedObj);
  }

  var episodeTable = $('table');
  var castList = $('.cast-list');
  var playPauseButton = $('.playPause');
  var player = $('#podPlayer');


  player.bind('timeupdate', function () {
    var currentTime = Math.floor(this.currentTime);
    $('#seeker').val(currentTime);
    function zeroFill( number, width )
    {
      width -= number.toString().length;
      if ( width > 0 )
      {
        return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
      }
      return number + ""; // always return a string
    }
    var momentDuration = moment.duration(currentTime, 'seconds');
    var hrs = zeroFill(momentDuration.hours(), 2);
    var min = zeroFill(momentDuration.minutes(), 2);
    var sec = zeroFill(momentDuration.seconds(), 2);
    $('#currTime').text(hrs +':'+min+':' +sec );
  });

  function castClick() {
    var castTitle = $(this).attr('data-cast');
    currentCast = podcasts[castTitle];
    displayEpisodes();
  }

  function addCast(podcast) {
    castList.append($('<div>', {
      'class': 'col s4',
      'data-cast': podcast.meta.title,
      click: castClick
    }).append($('<img>', {
      src: podcast.meta.image.url
    })));
  }

  function loadCasts() {
    for (podcastTitle in podcasts) {
      addCast(podcasts[podcastTitle]);
    }
  }

  loadCasts();

  function getFeed(feed_url) {
    $.get(rss_link + feed_url, function (podcast) {
      podcasts[podcast.meta.title] = data;
      localStorage.setItem('podcasts', JSON.stringify(podcasts));
      addCast(podcast);
    }, "json");
  }

  // Does not do anything
  function searchFeed(searchTerm) {
    $.get(search_link + searchTerm, function (data) {
      console.log(data);
    }, "json");
  }

  function displayEpisodes(feedTitle) {
    $('tbody').remove();
    for (var i = 0; i < currentCast.feed.length; i++) {
      var episode = currentCast.feed[i];
      var row = $('<tr>');
      var cell = $('<td>');

      cell.text(episode.title);
      if(episode.enclosures.length > 0){
        cell.attr('data-index', i);
      }else{
        console.log(episode.title);
      }
      cell.addClass('episode');
      row.append(cell);
      episodeTable.append(row);
    }
  }

  $('#addFeed').click(function () {
    var term = $('#searchbox').val();
    getFeed(term);
  });


  $('body').on('click','td', function() {
    var index = $(this).attr('data-index');
    var selectedEpisode = currentCast.feed[index];
    player.attr('src', selectedEpisode.enclosures[0].url);
    var episodeDuration = selectedEpisode['itunes:duration']['#'];
    var duration = moment.duration(episodeDuration).asSeconds();
    $('#seeker').attr('max', duration);
    player.trigger('play');
    playPauseButton.removeClass('mdi-av-play-arrow');
    playPauseButton.addClass('mdi-av-pause');
    $('#currTime').text('0:00:00');
    $('#endTime').text(episodeDuration);
  });



  playPauseButton.click(function() {
    if (!player.get(0).paused) {
      player.trigger('pause');
    } else {
      player.trigger('play');
    }
    playPauseButton.toggleClass('mdi-av-pause');
    playPauseButton.toggleClass('mdi-av-play-arrow');
  });

};

$(document).ready(main);
