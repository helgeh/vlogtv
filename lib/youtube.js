const request = require('superagent');
const qs = require('querystring');

class Youtube {

  constructor (options) {
    this.options = options || {};
    this.channels = {};
    this.endpoint = this.options.endpoint || 'https://www.googleapis.com/youtube/v3';
  }

  _request (path, params) {
    return new Promise((resolve, reject) => {
      var url = this.endpoint + path;
      if (params) url = url + '?' + qs.encode(params) + '&key=' + this.options.key;
      request
        .get(url)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          if (err || !res.ok) return reject('An error ocurred in the request ' + err);
          resolve(res.body);
        });
    });
  }

  search (params) {
    if (params.channel) {
      return this.getChannelId(params.channel).then(result => {
        params.channelId = result;
        return this._request('/search', params);
      });
    }
    return this._request('/search', params);
  }

  getChannelId (channelName) {
    if (this.channels[channelName])
      return Promise.resolve(this.channels[channelName].id);
    return this.getChannel(channelName).then(channel => {
      return channel.id;
    });
  }

  getChannel (channelName) {
    let params = {part: 'id', forUsername: channelName};
    return this._request('/channels', params).then((result) => {
      if (!result.items[0])
        return Promise.reject(new Error('No channel found'));
      this.channels[channelName] = result;
      return result.items[0];
    });
  }
}

module.exports = Youtube
