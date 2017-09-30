'use strict';

var moment = require('moment');

module.exports = {

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
        var data = Settings.getVlogData();
        console.log(data);
        var currentDate = moment.utc(data.currentDate);
        currentDate.utcOffset(0);
        currentDate.add(inc, data.span);
        data.currentDate = currentDate.toISOString();
        return data.currentDate;
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