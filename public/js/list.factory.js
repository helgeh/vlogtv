'use strict';

var moment = require('moment');

module.exports = ['$rootScope', '$http', 'Settings', function ($rootScope, $http, Settings) {
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
    loadPrev: function () {
      return promise.then(function (data) {
        if (curIndex - 1 >= 0)
          return data.items[--curIndex].id.videoId;
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

    // TODO rewrite this to take needed parameters. That way this could be called upon and not just blindly recall itself when rootscope emits events...
    reload: function () {
      var props, data, url;
      props = Settings.getPlayerOptions();
      data = Settings.getVlogData();
      if (!props.channelName || !data.span || !data.currentDate) {
        console.warn('Missing request data!');
        return;
      }
      url = '/vlog/' + props.channelName + '?date=' + data.currentDate + '&span=' + data.span;
      promise = $http.get(url).then(function (res) {
        res.data.items = res.data.items
          .filter(function(item) {
            return item.id.kind === 'youtube#video';
          })
          .sort(function (a, b) {
            var dateA = a.snippet.publishedAt,
              dateB = b.snippet.publishedAt;
            return (dateA < dateB) ? -1 : ((dateA > dateB) ? 1 : 0);
          });
        curIndex = 0;
        total = res.data.items.length;
        $rootScope.$emit('list:loaded', res.data);
        return res.data;
      });
      return promise;
    }
  }

  API.reload(); // <-- Appen får fader ikke bestemt seg om denne trengs eller ikke... 
  // Problemet er at vi får dobbel load når appen loader fordi vlogdata endrer seg av en eller annen grunn.
  // Men tydeligvis ikke alltid! :(

  $rootScope.$on('vlogData:changed', function (data) {
    API.reload();
  });
  $rootScope.$on('channel:changed', function (data) {
    API.reload();
  });

  return API;
}];