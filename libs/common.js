const crypto = require('crypto');

module.exports = {
	MD5_SUFFIX: 'jioef98wyf%%8wu**0w328r3##2weuohfwe9w--9==300',
	md5: function (str){
		var obj = crypto.createHash('md5');
		obj.update(str);
		return obj.digest('hex');
	}
}
