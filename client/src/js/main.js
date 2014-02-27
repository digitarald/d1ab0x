/** @jsx React.DOM */

var React = window.React = require('react');
var Router = require('director/build/director').Router;
var App = require('./components/app.js');

var router = new Router();

var routes = {
	'/': {
		name: 'home',
		component: require('./components/home-page')
	},
	'/wizard': {
		name: 'wizard',
		component: require('./components/wizard-page')
	}
};

React.renderComponent(
	App({
		router: router,
		routes: routes
	}),
	document.getElementById('wrap')
);
