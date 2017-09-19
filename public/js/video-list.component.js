'use strict';

var angular = require('angular');
var moment = require('moment');

angular.module('VlogTV')
.component('videoList', {
  templateUrl: '/templates/video-list.html',
  controller: function VideoListController ($rootScope, List, Vlog, Settings) {
    var ctrl = this;
    var updateDate = function() {
      var m = moment.utc(Settings.get('curDate'));
      ctrl.date = m.format('Do [of] MMMM YYYY [(]ddd[)]');
    }
    ctrl.videos = [];
    updateDate();
    $rootScope.$on('step', function (event, data) {
      updateDate();
    });
    List.getAll().then(function (data) {
      ctrl.videos = data.items;
      if (data.items && data.items.length > 0) ctrl.start(data.items[0]);
    });
    ctrl.start = function (video) {
      Vlog.load(video);
    };
    $rootScope.$on('list:loaded', function (event, data) {
      ctrl.videos = data.items;
      updateDate();
    });
  }
});