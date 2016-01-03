'use strict'
const stream = require('stream');
const Convert = require('ansi-to-html');
var util = require('util');
util.inherits(PrettifyLogs, stream.Transform);

function PrettifyLogs(options) {
  if (!(this instanceof PrettifyLogs))
    return new PrettifyLogs(options);

  stream.Transform.call(this, options);
  this.header = null;
  if(!options || options.html !== false){
    const convertStdOut = new Convert({stream: true});
    const convertStdErr = new Convert({stream: true});
    this.stdOutConvert = content => `<span class="stdout">${convertStdOut.toHtml(content)}</span>`;
    this.stdErrConvert = content => `<span class="stderr">${convertStdErr.toHtml(content)}</span>`;
  }else{
    this.stdOutConvert = content => content;
    this.stdErrConvert = content => content;
  }
}

PrettifyLogs.prototype._transform = function(chunk, encoding, done) {
  if(this.header == null || this.header.length == 0){
    this.header = chunk.slice(0, 8);
    chunk = chunk.slice(8);
  }
  while (this.header !== null && this.header.length) {
    let type = this.header.readUInt8(0);
    let length = this.header.readUInt32BE(4);
    let payload = chunk.slice(0, length);
    chunk = chunk.slice(length);
    if (payload === null || payload.length === 0) break;
    if (type == 2) {
      this.push(this.stdErrConvert(payload.toString('utf8')));
    } else {
      this.push(this.stdOutConvert(payload.toString('utf8')));
    }
    this.header = chunk.slice(0, 8);
    chunk = chunk.slice(8);
  }
  done();
};

module.exports = PrettifyLogs;