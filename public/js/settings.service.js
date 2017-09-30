'use strict';

var moment = require('moment');

module.exports = ['$rootScope', 'Store', function PropsService($rootScope, Store) {

  var playerOptions = Store.get('settings', {});
  var vlogData = Store.get('vlogs', {});

  if (playerOptions.channelName === undefined) { // first app is opened or local storage has been wiped
    addNewChannel('CaseyNeistat', '2015-03-26T00:00:00.000Z')
  }

  function addNewChannel(name, date) {
    date = date || moment().utc().startOf('day').toISOString();
    playerOptions.channelName = name;
    vlogData[playerOptions.channelName] = {
      currentDate: date,
      span: 'date'
    }
    Store.set('settings', playerOptions);
    Store.set('vlogs', vlogData);
  }

  function getPlayerOptions() {
    return playerOptions;
  }

  function getVlogData() {
    if (!vlogData[playerOptions.channelName]) {
      vlogData[playerOptions.channelName] = {currentDate: moment().utc().startOf('day').toISOString(), span: 'date'};
    }
    return vlogData[playerOptions.channelName];
  }

  function getChannelList() {
    return Object.keys(vlogData);
  }

  $rootScope.$watch(function () {
    return playerOptions;
  }, function playerOptionsChanged(newValue, oldValue) {
    Store.set('settings', newValue);
    if (newValue.channelName !== oldValue.channelName) {
      $rootScope.$emit('channel:changed', newValue.channelName);
    }
  }, true);

  $rootScope.$watch(function () {
    return vlogData;
  }, function vlogDataChanged(newValue, oldValue) {
    Store.set('vlogs', newValue);
    $rootScope.$emit('vlogData:changed', newValue); // TODO: maybe pass only changed values between oldValue and newValue properties?
  }, true);

  this.addNewChannel = addNewChannel;
  this.getPlayerOptions = getPlayerOptions;
  this.getVlogData = getVlogData;
  this.getChannelList = getChannelList;

}];