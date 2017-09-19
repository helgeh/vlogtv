'use strict';

var angular = require('angular');
var moment = require('moment');

angular.module('VlogTV')

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

.factory('Tools', function (Settings) {
  return {
    bumpCurrentDate: function (inc) {
      if (!inc) inc = 1;
      var currentDate = moment.utc(Settings.get('curDate'));
      currentDate.utcOffset(0);
      currentDate.add(inc, 'day');
      var isoStr = currentDate.toISOString();
      Settings.set('curDate', isoStr);
      return isoStr;
    },
    // bumpDate: function (isoStr, inc) {
    //   if (!inc) inc = 1;
    //   var date = new Date(isoStr);
    //   date.setDate(date.getDate() + inc);
    //   return date.toISOString();
    // }
  }
});