'use strict';

var moment = require('moment');

module.exports = ['$rootScope', 'Vlog', 'Settings', function ControlsController ($rootScope, Vlog, Settings) {
    var ctrl = this;

    ctrl.props = Settings.getPlayerOptions();
    ctrl.vlogData = Settings.getVlogData();
    ctrl.date = moment(ctrl.vlogData.currentDate).toDate();

    $rootScope.$on('channel:changed', function (newValue) {
      ctrl.vlogData = Settings.getVlogData();
      ctrl.date = moment(ctrl.vlogData.currentDate).toDate();
    });

    $rootScope.$on('vlogData:changed', function (data) {
      ctrl.vlogData = Settings.getVlogData();
      ctrl.date = moment(ctrl.vlogData.currentDate).toDate();
    });

    ctrl.dateChanged = function () {
      ctrl.vlogData.currentDate = moment.utc(ctrl.date.toISOString()).toISOString();
    };

    ctrl.prev = function () {
      Vlog.prev();
    };
    ctrl.next = function () {
      Vlog.next();
    };
  }
];