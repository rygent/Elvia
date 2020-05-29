/* eslint-disable func-names */
module.exports = {
	responseTime: function (message) {
		const time = Date.now() - message.createdTimestamp;
		return `${time || 0} ms`;
	}
};
