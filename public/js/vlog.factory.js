'use strict';

module.exports = ['$rootScope', 'Settings', 'List', 'Player', 'Tools', function ($rootScope, Settings, List, Player, Tools) {
  var settings = Settings.getPlayerOptions();
  var data = Settings.getVlogData();
  var API = {
    load: function (param) {
      if (typeof param === 'string') {
        Player.load(param);
      }
      else if (param.items && param.items.length > 0) {
        var video = param.items[0];
        Player.load(video.id.videoId);
        List.setCurrent(video);
      }
      else if (param.id && param.id.videoId) {
        Player.load(param.id.videoId);
        List.setCurrent(param);
      }
    },
    next: function () {
      if (!List.hasMore()) {
        Tools.bumpCurrentDate(1);
      }
      else {
        List.loadNext().then(API.load);
      }
      $rootScope.$broadcast('step', 'next');
    },
    prev: function () {
      if (List.isFirst()) {
        Tools.bumpCurrentDate(-1);
      }
      else {
        List.loadPrev().then(API.load);
      }
      $rootScope.$broadcast('step', 'prev');
    }
  };
  $rootScope.$on('player:stopped', function () {
    if (settings.autoPlay) {
      API.next();
      Player.play();
    }
  });
  $rootScope.$on('list:loaded', function (event, data) {
    if (data.items && data.items.length > 0)
      API.load(data.items[0]);
  });
  $rootScope.$on('channel:changed', function (channelName) {
    settings = Settings.getPlayerOptions();
  });
  return API;
}];