const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
require('dayjs/locale/vi');
dayjs.extend(utc);
dayjs.extend(timezone);

const vietnamTime = (t) => dayjs(t).locale('vi').tz('Asia/Ho_Chi_Minh');

module.exports = vietnamTime;
