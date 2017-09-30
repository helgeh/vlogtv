'use strict';

module.exports = [
  '$rootScope', 'List', 'Vlog', 'Settings',
  function VideoListController ($rootScope, List, Vlog, Settings) {

    var ctrl = this;

    ctrl.start = function (video) {
      Vlog.load(video);
    };

    $rootScope.$on('list:loaded', function (event, data) {
      ctrl.videos = data.items;
      ctrl.date = Settings.getVlogData().currentDate;
    });

    $rootScope.$on('vlogData:changed', function (data) {
      ctrl.date = Settings.getVlogData().currentDate;
    });
  }
];