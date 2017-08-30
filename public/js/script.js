'use strict';

angular.module('CaseyTV', [])

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
      next: function () {
        if (!List.hasMore()) {
          var cur = Tools.bumpDate(Settings.get('curDate'));
          Settings.set('curDate', cur);
          List.reload().then(API.load);
        }
        else {
          List.loadNext().then(API.load);
        }
      },
      prev: function () {
        if (List.isFirst()) {
          var cur = Tools.bumpDate(Settings.get('curDate'), -1);
          Settings.set('curDate', cur);
          List.reload().then(API.load);
        }
        else {
          List.loadPrev().then(API.load);
        }
      }
    };
    $rootScope.$on('player:stopped', function () {
      if (Settings.get('autoPlay')) {
        API.next();
        Player.play();
      }
    });
    return API;
  })

  .component('videoList', {
    templateUrl: '/templates/video-list.html',
    controller: function VideoListController ($rootScope, List, Vlog) {
      var ctrl = this;
      ctrl.videos = [];
      List.getAll().then(function (data) {
        ctrl.videos = data.items;
        if (data.items && data.items.length > 0) ctrl.start(data.items[0]);
      });
      ctrl.start = function (video) {
        Vlog.load(video);
      };
      $rootScope.$on('list:loaded', function (event, data) {
        ctrl.videos = data.items;
      });
    }
  })

  .factory('List', function ($rootScope, $http, Settings) {
    var curIndex, total, promise;
    var API = {
      getAll: function () {
        return promise;
      },
      loadNext: function () {
        return promise.then(function (data) {
          if (curIndex + 1 < data.items.length)
            return data.items[++curIndex].id.videoId;
          return Promise.reject(new Error('No more videos'));
        });
      },
      hasMore: function () {
        return curIndex + 1 < total;
      },
      isFirst: function () {
        return curIndex === 0;
      },
      setCurrent: function (video) {
        return promise.then(function (data) {
          curIndex = data.items.indexOf(video);
        });
      },
      // reverse: function () {
      //  // body...
      // },
      reload: function () {
        var date = Settings.get('curDate') || '2015-03-26';
        var url = '/vlog/CaseyNeistat?date=' + date;
        promise = $http.get(url).then(function (res) {
          res.data.items = res.data.items
            .filter(function(item) {
              return item.id.kind === 'youtube#video';
            })
            .sort(function (a, b) {
              return a.snippet.publishedAt > b.snippet.publishedAt;
            });
          curIndex = 0;
          total = res.data.items.length;
          Settings.set('curDate', date);
          $rootScope.$emit('list:loaded', res.data);
          return res.data;
        });
        return promise;
      }
    }
    API.reload();
    return API;
  })

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
  })

  .component('controls', {
    templateUrl: '/templates/controls.html',
    controller: function ControlsController ($scope, Vlog, Settings) {
      var ctrl = this;
      ctrl.autoPlay = Settings.get('autoPlay') > 0;
      ctrl.toggleAutoPlay = function () {
        Settings.set('autoPlay', ctrl.autoPlay ? 1 : 0);
      };
      ctrl.prev = function () {
        Vlog.prev();
      };
      ctrl.next = function () {
        Vlog.next();
      };
    }
  })

  .factory('Settings', function (Store) {
    var settings = Store.get('settings');
    if (!settings)
      settings = {};
    return {
      set: function (prop, val) {
        settings[prop] = val;
        Store.set('settings', settings);
      },
      get: function (prop) {
        return settings[prop];
      }
    }
  })

  .factory('Store', function () {
    var storage = window.localStorage;
    return {
      get: function (prop) {
        return JSON.parse(storage.getItem(prop));
      },
      set: function (prop, val) {
        storage.setItem(prop, JSON.stringify(val));
      }
    }
  })

  .factory('Tools', function () {
    return {
      bumpDate: function (isoStr, inc) {
        if (!inc) inc = 1;
        var date = new Date(isoStr);
        date.setDate(date.getDate() + inc);
        return date.toISOString();
      }
    }
  });