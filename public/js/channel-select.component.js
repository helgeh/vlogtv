'use strict';

module.exports = ['$scope', '$rootScope', 'Vlog', 'Settings', function ChannelSelectController ($scope, $rootScope, Vlog, Settings) {
    var ctrl = this;
    ctrl.channelName = Settings.get('channelName');
    ctrl.channel = function (name) {
      ctrl.channelName = name;
      Vlog.setChannel(name);
    };
    ctrl.channelList = Settings.get('channelList');
    ctrl.onChannelChange = function () {
      if (ctrl.channelName === '_edit_') {
        var newName = prompt('Type channel name');
        if (ctrl.channelList.indexOf(newName) < 0) {
          ctrl.channelList.push(newName);
        }
        ctrl.channel(newName);
      }
      else {
        Vlog.setChannel(ctrl.channelName);
      }
    }
  }
];