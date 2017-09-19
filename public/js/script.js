'use strict';

var angular = require('angular');

angular.module('VlogTV', [])
  
  .run(function (Settings) {
    Settings.set('curDate', Settings.get('curDate') || '2015-03-26T00:00:00.0000Z');
  });

require('./vlog.factory');
require('./list.factory');
require('./player.factory');
require('./controls.component');
require('./video-list.component');
require('./utils');