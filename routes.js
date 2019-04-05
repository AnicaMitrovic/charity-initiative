const routes = require('next-routes')();

//new roude mapping, : is like wildcard
routes
	.add('/initiatives/new', 'initiatives/new')
	.add('/initiatives/:address', '/initiatives/show')
	.add('/initiatives/:address/request', '/initiatives/request');

module.exports = routes;
