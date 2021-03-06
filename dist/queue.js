'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _headers = require('./headers');

var _headers2 = _interopRequireDefault(_headers);

var _bytes = require('./bytes');

var _bytes2 = _interopRequireDefault(_bytes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Queue = function Queue() {
  var _this = this;

  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  _classCallCheck(this, Queue);

  this.tasks = options['start-id'] || 1;
  this.queue = _async2.default.queue(function (task, callback) {
    options.type = options.type || 'png';
    var diff = options.size.toString().length - _this.tasks.toString().length,
        id = '0'.repeat(diff < 0 ? 0 : diff).concat(_this.tasks++),
        name = (options.prefix || 'frame') + '_' + id + '.' + options.type,
        file = _fs2.default.createWriteStream(name);
    if (options['zero-byte']) {
      file.write('', 'utf8', function () {
        setTimeout(function () {
          file.write(_headers2.default[options.type]);
          file.write((0, _bytes2.default)(task));
          file.end();
        }, options['write-delay'] || 5);
      });
    } else {
      file.write(_headers2.default[options.type]);
      file.write((0, _bytes2.default)(task));
      file.end();
    }
    file.on('finish', function () {
      console.log('Syni is writing %s...', name);
      callback();
    });
  }, options['write-with'] || 1);
  this.queue.drain = function () {
    console.log('done.');
  };
  return this.queue;
};

exports.default = Queue;