var path = require('path');
var webpack = require('webpack');

module.exports = {
	cache: true,
	context: path.join(__dirname, 'client', 'src'),
	entry: './js/main.js',
	output: {
		path: path.join(__dirname, 'client', 'dist'),
		publicPath: 'dist/',
		filename: 'src.js'
	},
	resolve: {
		modulesDirectories: ['node_modules']
	},
	module: {
		loaders: [{
				test: /\.js$/,
				loader: 'jsx-loader'
			}, {
				test: /\.gif/,
				loader: 'url-loader?limit=10000&minetype=image/gif'
			}, {
				test: /\.jpg/,
				loader: 'url-loader?limit=10000&minetype=image/jpg'
			}, {
				test: /\.png/,
				loader: 'url-loader?limit=10000&minetype=image/png'
			},
			// required to write 'require('./style.css')'
			{
				test: /\.less$/,
				loader: 'style-loader!css-loader!less-loader'
			}, {
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			},
			// required for bootstrap icons
			{
				test: /\.woff$/,
				loader: 'url-loader?prefix=font/&limit=5000&minetype=application/font-woff'
			}, {
				test: /\.ttf$/,
				loader: 'file-loader?prefix=font/'
			}, {
				test: /\.eot$/,
				loader: 'file-loader?prefix=font/'
			}, {
				test: /\.svg$/,
				loader: 'file-loader?prefix=font/'
			}
		]
	},
	plugins: [
		new webpack.optimize.DedupePlugin()
	]
};