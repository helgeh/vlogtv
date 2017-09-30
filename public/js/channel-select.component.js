'use strict';

module.exports = ['$rootScope', 'Settings', function ChannelSelectController ($rootScope, Settings) {
  var ctrl = this;

  ctrl.props = Settings.getPlayerOptions();
  ctrl.setChannel = function (name) {
    ctrl.props.channelName = name;
  };

  ctrl.channelList = Settings.getChannelList();
  ctrl.onChannelChange = function () {
    if (ctrl.props.channelName === '_edit_') {
      var newName = prompt('Type channel name');
      if (ctrl.channelList.indexOf(newName) < 0) {
        ctrl.channelList.push(newName);
      }
      Settings.addNewChannel(newName);
    }
  }

}];