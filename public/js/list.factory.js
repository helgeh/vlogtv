'use strict';

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
    reload: function () {
      var channel = Settings.get('channelName') || 'CaseyNeistat';
      var date = Settings.get('curDate');
      var url = '/vlog/' + channel + '?date=' + date;
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
}];