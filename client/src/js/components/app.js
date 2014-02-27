/** @jsx React.DOM */

var React = require('react/react');
// var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('../../css/main.less');

var App = React.createClass({
	getInitialState: function() {
		return {
			route: null
		};
	},

	componentWillMount : function() {
		var routes = this.props.routes;
		for (var route in routes) {
			var setter = this.setState.bind(this, {route: route});
			this.props.router.on(route, setter);
		}
		this.props.router.configure({
			notfound: function() {
				this.setHash('/');
			}
		}).init('/');
	},

	/*jshint ignore:start */
	render: function() {
		var route = this.props.routes[this.state.route];
		if (!route) {
			route = {
				name: null,
				component: React.DOM.div
			};
		}
		var component = route.component;
		return (
			<div className='app'>
				<component />
			</div>
		);
	}
	/*jshint ignore:end */
});

module.exports = App;
