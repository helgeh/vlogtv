'use strict';

var angular = require('angular');
var moment = require('moment');

angular.module('VlogTV')
.factory('Vlog', function ($rootScope, Settings, List, Player, Tools) {
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
    setDate: function (date) {
      var m = moment.utc(date);
      if (m.isValid()) {
        Settings.set('curDate', m.toISOString());
        List.reload().then(API.load);
      }
    },
    next: function () {
      if (!List.hasMore()) {
        Tools.bumpCurrentDate();
        List.reload().then(API.load);
      }
      else {
        List.loadNext().then(API.load);
      }
      $rootScope.$broadcast('step', 'next');
    },
    prev: function () {
      if (List.isFirst()) {
        Tools.bumpCurrentDate(-1);
        List.reload().then(API.load);
      }
      else {
        List.loadPrev().then(API.load);
      }
      $rootScope.$broadcast('step', 'prev');
    }
  };
  $rootScope.$on('player:stopped', function () {
    if (Settings.get('autoPlay')) {
      API.next();
      Player.play();
    }
  });
  return API;
});