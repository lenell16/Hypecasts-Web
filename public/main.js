var main = function () {

  // Contacting Server
  var rss_link = '/rss?link=';
  var search_link = '/search?term=';

  var podcasts = {};

  var table = $('table');
  var castList = $('.cast-list');

  function getFeed(feed_url) {
    $.get(rss_link + feed_url, function (data) {
      podcasts[data.meta.title] = data;

      castList.append($('<div>', {
        'class': 'col s4',
        'data-cast': data.meta.title,
        click: function () {
          displayEpisodes($(this).attr('data-cast'));
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
    podcasts[feedTitle].feed.forEach(function (episode) {
      var row = $('<tr>');
      var cell = $('<td>');

      cell.text(episode.title);
      if(episode.enclosures.length > 0){
        cell.attr('data-src', episode.enclosures[0].url);
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
    var url = $(this).attr('data-src');
    if(player.length){
      player.attr('src', url);
    } else {
      var url = $(this).attr('data-src');
      player = $('<audio>');
      player.attr('src', url);
      $('body').append(player);
    }
    player.trigger('play');
  });


  $('.playPause').click(function () {

  });

};

$(document).ready(main);
