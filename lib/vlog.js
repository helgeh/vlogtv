const Youtube = require('./youtube');

class Vlog {

  constructor(channelName) {
    this.yt = new Youtube({key: process.env.G_SECRET || ''});
    this.params = {
      channel: 'CaseyNeistat',
      part: 'snippet',
      maxResults: 5,
      order: 'date'
    };
    this.params.channel = channelName;

    let today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    this.params.publishedAfter = today.toISOString();
    this.params.publishedBefore = this._bump(today.toISOString());
  }

  setName(str) {
    this.params.channel = str;
  }

  getName() {
    return this.params.channel;
  }

  setDate(date) {
    this.params.publishedAfter = date.toISOString();
    this.params.publishedBefore = this._bump(this.params.publishedAfter);
  }

  getDate() {
    return new Date(this.params.publishedAfter);
  }

  reload() {
    return this.yt.search(this.params);
  }

  bumpDate(inc) {
    if (!inc) inc = 1;
    this.params.publishedAfter = this._bump(this.params.publishedAfter, inc);
    this.params.publishedBefore = this._bump(this.params.publishedBefore, inc);
  }

  _bump(isoStr, inc) {
    if (!inc) inc = 1;
    let date = new Date(isoStr);
    date.setDate(date.getDate() + inc);
    return date.toISOString();
  }
}

module.exports = Vlog;