'use strict';

var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less');
var webpack = require('webpack');
var webpackMiddleware = require("webpack-dev-middleware");
var webpackConfig = require('./webpack.config.js');

gulp.task('default', ['webpack-dev-server'], function() {});


gulp.task('webpack:build', function(callback) {
	// modify some webpack config options
	var config = Object.create(webpackConfig);
	config.plugins = config.plugins.concat(
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin()
	);

	// run webpack
	webpack(config, function(err, stats) {
		if (err) throw new gutil.PluginError('webpack:build', err);
		gutil.log('[webpack:build]', stats.toString({
			colors: true
		}));
		callback();
	});
});

var devConfig = Object.create(webpackConfig);
devConfig.devtool = 'sourcemap';
devConfig.debug = true;

var devCompiler = webpack(devConfig);

gulp.task('webpack:build-dev', function(callback) {
	// run webpack
	devCompiler.run(function(err, stats) {
		if (err) throw new gutil.PluginError('webpack:build-dev', err);
		gutil.log('[webpack:build-dev]', stats.toString({
			colors: true
		}));
		callback();
	});
});

var serverConfig = Object.create(devConfig);
serverConfig.debug = true;

gulp.task('webpack:dev-server', function(callback) {
	var express = require('express');
	var app = express();
	var server = require('http').createServer(app);
	// app.use(express.compress());
	app.use(webpackMiddleware(webpack(serverConfig), {
		publicPath: '/' + serverConfig.output.publicPath,
		stats: {
			colors: true
		}
	}));
	app.use('/', express.static(path.join(__dirname, 'client')));
	app.use(express.errorHandler());

	app.listen(8081);
});
