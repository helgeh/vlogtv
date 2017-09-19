const Youtube = require('./youtube');
const moment = require('moment');

class Vlog {

  constructor(channelName) {
    this.yt = new Youtube({key: process.env.G_SECRET || ''});
    this.params = {
      channel: 'CaseyNeistat',
      part: 'snippet',
      maxResults: 50,
      order: 'date'
    };
    this.params.channel = channelName;

    let today = moment().startOf('day');
    this.params.publishedAfter = today.toISOString();
    this.params.publishedBefore = this._bumpDate(today.toISOString());
  }

  setName(str) {
    this.params.channel = str;
  }

  getName() {
    return this.params.channel;
  }

  setDate(date, span) {
    this.params.publishedAfter = date.toISOString();
    this.params.publishedBefore = this._bumpDate(this.params.publishedAfter);
    if (span)
      this.setSpan(span);
  }

  getDate() {
    return moment(this.params.publishedAfter);
  }

  reload() {
    return this.yt.search(this.params);
  }

  setSpan(unit) {
    if (unit === 'week') {
      this.params.publishedAfter = moment(this.params.publishedAfter).startOf('week').toISOString();
      this.params.publishedBefore = moment(this.params.publishedAfter).endOf('week').toISOString();
    }
    else if (unit === 'month') {
      this.params.publishedAfter = moment(this.params.publishedAfter).startOf('month').toISOString();
      this.params.publishedBefore = moment(this.params.publishedAfter).endOf('month').toISOString();
    }
    else {
      this.params.publishedAfter = date.toISOString();
      this.params.publishedBefore = this._bumpDate(this.params.publishedAfter);
    }
  }

  bumpDate(inc) {
    if (!inc) inc = 1;
    this.params.publishedAfter = this._bumpDate(this.params.publishedAfter, inc);
    this.params.publishedBefore = this._bumpDate(this.params.publishedBefore, inc);
  }

  _bumpDate(isoStr, inc) {
    if (!inc) inc = 1;
    let date = moment(isoStr);
    date.add(inc, 'day');
    return date.toISOString();
  }

  _bumpWeek(isoStr, inc) {
    if (!inc) inc = 1;
    let date = moment(isoStr);
    date.add(inc, 'week');
    return date.toISOString();
  }

  _bumpMonth(isoStr, inc) {
    if (!inc) inc = 1;
    let date = moment(isoStr);
    date.add(inc, 'month');
    return date.toISOString();
  }
}

module.exports = Vlog;