/** @jsx React.DOM */

var React = require('react/react');

var HomePage = React.createClass({
	render: function() {
		return (
			<div className='page-full'>
				<a role='button' className='btn' href='./#/wizard'>Build your Thought Box</a>
			</div>
		);
	}
});

module.exports = HomePage;
