
var Stream = require('stream').Stream
  , util = require('util');

function NJStream(delimiter) {
  Stream.call(this);
  this.writable = true;
  this.delimiter = delimiter || '\n';
  this.buffer = '';
}

util.inherits(NJStream, Stream);

NJStream.prototype.parse = function(data) {
  var self = this;
  var delim = data.indexOf(self.delimiter);
  if(delim > 0) {
    self.buffer += data.substr(0, delim);
    try {
      self.emit('parsed', JSON.parse(self.buffer));
    } catch(e) {
      self.emit('error', e);
    }

    self.buffer = '';

    if(delim !== data.length - 1) {
      self.parse(data.substr(delim + 1));        
    }

  } else {
  
    if(delim === 0) {
      data = data.substr(1);
    }

    self.buffer += data;
  }
};

NJStream.prototype.write = function(data) {
  this.parse(data);
  return true;
};

NJStream.prototype.end = function(data) {
  if(data) {
    this.parse(data);
  }
  this.writable = false;
};

module.exports = NJStream;
