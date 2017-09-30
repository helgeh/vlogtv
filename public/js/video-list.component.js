'use strict';

module.exports = [
  '$rootScope', 'List', 'Vlog', 'Settings',
  function VideoListController ($rootScope, List, Vlog, Settings) {

    var ctrl = this;

    // TODO: show different titles depending on the type of time span this vlog is using

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