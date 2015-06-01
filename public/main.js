var podcasts = {};

var main = function () {

  // Contacting Server
  var rss_link = '/rss?link=';
  var search_link = '/search?term=';


  var currentCast = '';
  var retrievedObj;
  if (retrievedObj = localStorage.getItem('podcasts')) {
    podcasts = JSON.parse(retrievedObj);
  }

  var table = $('table');
  var castList = $('.cast-list');
  var playPause = $('.playPause');

  function loadCasts() {
    for (podcastTitle in podcasts) {
      castList.append($('<div>', {
        'class': 'col s4',
        'data-cast': podcastTitle,
        click: function () {
          console.log($(this).attr('data-cast'));
          displayEpisodes($(this).attr('data-cast'));
          currentCast = $(this).attr('data-cast');
        }
      }).append($('<img>', {
        src: podcasts[podcastTitle].meta.image.url
      })));
    }
  }

  loadCasts();

  function getFeed(feed_url) {
    $.get(rss_link + feed_url, function (data) {
      podcasts[data.meta.title] = data;
      localStorage.setItem('podcasts', JSON.stringify(podcasts));
      castList.append($('<div>', {
        'class': 'col s4',
        'data-cast': data.meta.title,
        click: function () {
          displayEpisodes($(this).attr('data-cast'));
          currentCast = $(this).attr('data-cast');
        }
      }).append($('<img>', {
        src: data.meta.image.url
      })));

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
    podcasts[feedTitle].feed.forEach(function (episode, index) {
      var row = $('<tr>');
      var cell = $('<td>');

      cell.text(episode.title);
      if(episode.enclosures.length > 0){
        cell.attr('data-index', index);
      }else{
        console.log(episode.title);
      }
      cell.addClass('episode');
      row.append(cell);
      table.append(row);
    });
  }

  $('button').click(function () {
    var term = $('#searchbox').val();
    getFeed(term);
  });


  $('body').on('click','td', function() {
    var player = $('audio');
    var index = $(this).attr('data-index');
    player.attr('src', podcasts[currentCast].feed[index].enclosures[0].url);
    var duration = moment.duration(podcasts[currentCast].feed[index]['itunes:duration']['#']).asSeconds();
    $('#seeker').attr('max', duration);
    player.trigger('play');
    playPause.removeClass('mdi-av-play-arrow');
    playPause.addClass('mdi-av-pause');
    $('#currTime').text('0:00:00');
    $('#endTime').text(podcasts[currentCast].feed[index]['itunes:duration']['#']);
  });

  $('body').append($('<audio>', {'id': 'podPlayer'}));
  $('audio').bind('timeupdate', function () {
    $('#seeker').val(Math.floor(this.currentTime));
    function zeroFill( number, width )
    {
      width -= number.toString().length;
      if ( width > 0 )
      {
        return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
      }
      return number + ""; // always return a string
    }
    var hrs = moment.duration(Math.floor(this.currentTime), 'seconds').hours();
    var min = zeroFill(moment.duration(Math.floor(this.currentTime), 'seconds').minutes(), 2);
    var sec = zeroFill(moment.duration(Math.floor(this.currentTime), 'seconds').seconds(), 2);
    console.log(hrs, min, sec);
    $('#currTime').text('' + hrs +':'+min+':' +sec );
  });

  playPause.click(function() {
    var player = $('audio');
    if (player.get(0).paused == false) {
      player.trigger('pause');
      playPause.removeClass('mdi-av-pause');
      playPause.addClass('mdi-av-play-arrow');
    } else {
      player.trigger('play');
      playPause.removeClass('mdi-av-play-arrow');
      playPause.addClass('mdi-av-pause');
    }
  });

};

$(document).ready(main);
