const common = require('./libs/common');

var str = '123456';
var password = common.md5(str+'jioef98wyf%%8wu**0w328r3##2weuohfwe9w--9==300');
console.log(password);
