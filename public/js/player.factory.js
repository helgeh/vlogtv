'use strict';

var angular = require('angular');

angular.module('VlogTV')
.factory('Player', function ($rootScope, Settings) {
  var player, loadWhenReady, playWhenReady, isPlaying;

  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }
  function onPlayerReady(event) {
    if (loadWhenReady) {
      API.load(loadWhenReady);
      loadWhenReady = null;
    }
  }
  function onPlayerStateChange(event) {
    isPlaying = event.data == YT.PlayerState.PLAYING;
    if (event.data === 0) {
      $rootScope.$emit('player:stopped');
    }
    if (player.getPlayerState() === YT.PlayerState.CUED && playWhenReady) {
      player.playVideo();
      playWhenReady = false;
    }
  }
  var API = {
    load: function (id) {
      if (!player.cueVideoById) {
        loadWhenReady = id;
      }
      else player.cueVideoById(id);
    },
    play: function () {
      var state = player.getPlayerState();
      if ([YT.PlayerState.CUED, YT.PlayerState.PAUSED].indexOf(state) < 0)
        playWhenReady = true;
      else
        player.playVideo();
    },
    isPlaying: function () {
      return isPlaying;
    }
  };
  return API;
});