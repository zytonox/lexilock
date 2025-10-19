const path = require('path');

const learnConfig = {
	name: 'learn',
	mode: 'production',
	entry: './scripts/learn.js',
	output: {
		filename: 'learn.bundle.js',
		path: path.resolve(__dirname, 'scripts/bundles'),
	},
	watch: false,
	devtool: 'source-map',
	module: {},
};

const manageConfig = {
	name: 'manage',
	mode: 'production',
	entry: './scripts/manage.js',
	output: {
		filename: 'manage.bundle.js',
		path: path.resolve(__dirname, 'scripts/bundles'),
	},
	watch: false,
	devtool: 'source-map',
	module: {},
};

module.exports = [learnConfig, manageConfig];
