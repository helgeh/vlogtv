'use strict';

module.exports = [
  '$filter', '$rootScope', 'Vlog', 'Settings',
  function VideoListController ($filter, $rootScope, Vlog, Settings) {

    var ctrl = this;

    function updateView() {
      var data = Settings.getVlogData();
      ctrl.date = data.currentDate;
      setHeading(data.span);
    }

    function setHeading(span) {
      if (span === 'month') ctrl.heading = 'Videos released in ' + $filter('date')(ctrl.date, 'MMMM y');
      else if (span === 'week') ctrl.heading = 'Videos released week ' + $filter('date')(ctrl.date, "w 'of' y");
      else ctrl.heading = 'Videos released on ' + $filter('prettyDate')(ctrl.date);
    }

    ctrl.start = function (video) {
      Vlog.load(video);
    };

    $rootScope.$on('list:loaded', function (event, data) {
      ctrl.videos = data.items;
      updateView();
    });

    $rootScope.$on('vlogData:changed', function (data) {
      updateView();
    });
  }
];