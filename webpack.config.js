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

const addConfig = {
	name: 'add',
	mode: 'production',
	entry: './scripts/add.js',
	output: {
		filename: 'add.bundle.js',
		path: path.resolve(__dirname, 'scripts/bundles'),
	},
	watch: false,
	devtool: 'source-map',
	module: {},
};

module.exports = [learnConfig, addConfig];
