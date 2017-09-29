'use strict';

var moment = require('moment');

module.exports = ['$scope', '$rootScope', 'Vlog', 'Settings', function ControlsController ($scope, $rootScope, Vlog, Settings) {
    var ctrl = this;
    ctrl.autoPlay = Settings.get('autoPlay') > 0;
    ctrl.toggleAutoPlay = function () {
      Settings.set('autoPlay', ctrl.autoPlay ? 1 : 0);
    };
    ctrl.date = moment(Settings.get('curDate')).toDate();
    ctrl.dateChanged = function () {
      if (ctrl.date) {
        var m = moment.utc(ctrl.date.toISOString());
        Vlog.setDate(m.toISOString());
      }
    };
    $scope.$on('step', function (event, data) {
      ctrl.date = new Date(Settings.get('curDate'));
    });
    ctrl.prev = function () {
      Vlog.prev();
    };
    ctrl.next = function () {
      Vlog.next();
    };
    $rootScope.$on('list:loaded', function (event, data) {
      ctrl.date = moment(Settings.get('curDate')).toDate();
    });
  }
];