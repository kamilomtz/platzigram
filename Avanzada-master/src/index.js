require('babel-polyfill');
var page = require('page');
require('moment/locale/es');

require('./homepage');
require('./signup');
require('./signin');
require('./footer');

page();