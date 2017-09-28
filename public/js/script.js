'use strict';

var angular = require('angular');

angular.module('VlogTV', [])
  
  .run(function (Settings) {
    Settings.set('curDate', Settings.get('curDate') || '2015-03-26T00:00:00.0000Z');
  })

  .factory('Vlog', require('./vlog.factory'))
  .factory('List', require('./list.factory'))
  .factory('Player', require('./player.factory'))

  .component('controls', {
    templateUrl: '/templates/controls.html',
    controller: require('./controls.component')
  })
  .component('videoList', {
    templateUrl: '/templates/video-list.html',
    controller: require('./video-list.component')
  });

var utils = require('./utils');
Object.keys(utils).forEach(function (key) {
  angular.module('VlogTV').factory(key, utils[key]);
});