'use strict';

var angular = require('angular');
var moment = require('moment');

angular.module('VlogTV', [])
  
  .config(function($locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
  })

  .run(function ($location, Settings) {
    var query = $location.search();
    if (query) {
      if (query.vlog && query.date) {
        var opts = Settings.getPlayerOptions();
        opts.channelName = query.vlog;
        var data = Settings.getVlogData();
        data.currentDate =  moment.utc(query.date).toISOString();
        data.span = query.span || 'week';
        $location.search({});
      }
    }
  })

  .factory('Vlog', require('./vlog.factory'))
  .factory('List', require('./list.factory'))
  .factory('Player', require('./player.factory'))

  .service('Settings', require('./settings.service'))

  .component('controls', {
    templateUrl: '/templates/controls.html',
    controller: require('./controls.component')
  })
  .component('channelSelect', {
    templateUrl: '/templates/channel-select.html',
    controller: require('./channel-select.component')
  })
  .component('videoList', {
    templateUrl: '/templates/video-list.html',
    controller: require('./video-list.component')
  });

var utils = require('./utils');
Object.keys(utils).forEach(function (key) {
  angular.module('VlogTV').factory(key, utils[key]);
});

var filters = require('./filters');
Object.keys(filters).forEach(function (key) {
  angular.module('VlogTV').filter(key, filters[key]);
});