'use strict';

var moment = require('moment');

module.exports = {

  Settings: ['Store', function (Store) {
    var settings = Store.get('settings');
    if (!settings)
      settings = {};
    var specials = {
      curDate: function (val) {
        if (val) {
          return API.setDate(val);
        }
        var date = API.getDate(settings['channelName']);
        if (!date)
          date = moment().toISOString();
        return date;
      },
      channelList: function (val) {
        if (val) {
          // As long as these are gathered from the vlogs object's keys I don't see an 
          // easy way or even a logical way to write this.
          // If a new channel was added to the list then it will evenutally be added
          // when it gets a currentDate.
          throw "Not implemented!"
        }
        else {
          return Object.keys(Store.get('vlogs', {}));
        }
      }
    };
    var API = {
      set: function (prop, val) {
        if (specials[prop])
          return specials[prop](val);
        settings[prop] = val;
        Store.set('settings', settings);
      },
      get: function (prop) {
        if (specials[prop] !== undefined)
          return specials[prop]();
        return settings[prop];
      },
      getChannelName: function () {
        return settings['channelName'];
      },
      setChannelName: function (val) {
        settings['channelName'] = val;
        Store.set('settings', settings);
      },
      getDate: function (channelName) {
        var vlogData = Store.get('vlogs', {});
        return (vlogData[channelName] || {}).currentDate;
      },
      setDate: function (date) {
        var vlogData = Store.get('vlogs', {});
        var name = API.getChannelName();
        if (!vlogData[name])
          vlogData[name] = {};
        vlogData[name].currentDate = moment(date).toISOString();
        Store.set('vlogs', vlogData);
      }
    };
    return API;
  }],

  Store: [function () {
    var storage = window.localStorage;
    return {
      get: function (prop, defaultVal) {
        var val = JSON.parse(storage.getItem(prop));
        if (!val && defaultVal)
          val = defaultVal;
        return val;
      },
      set: function (prop, val) {
        storage.setItem(prop, JSON.stringify(val));
      }
    }
  }],

  Tools: ['Settings', function (Settings) {
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
  }]
};