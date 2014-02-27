/** @jsx React.DOM */

var React = require('react/react');

var WizardPage = React.createClass({
	getInitialState: function() {
		return {
			step: 0,
			topic: 'Start a Fire',
			audience: 'The World',
			action: 'Know what you want',
			questions: [
				{
					key: 'question0',
					value: 'Are we human?'
				},
				{
					key: 'question1',
					value: 'Are we dancers?'
				}
			],
			resistance: 'High investment',
			motivation: 'High risk'
		};
	},

	getDefaultProps: function() {
		return {
			steps: [
				{
					states: 'topic',
					title: 'Topic',
					component: TopicStep
				},
				{
					states: 'audience',
					title: 'Audience',
					component: AudienceStep
				},
				{
					states: 'action',
					title: 'Action',
					component: ActionStep
				},
				{
					states: 'questions',
					title: 'Questions',
					component: QuestionsStep
				},
				{
					states: ['resistance', 'motivation'],
					title: 'Pro/Contra',
					component: ProContraStep
				}
			]
		};
	},

	handleSectionChange: function(values) {
		this.setState(values);
	},

	handleSectionPrevious: function() {
		var step = this.state.step - 1;
		if (step >= 0) {
			this.setState({step: step});
		}
	},

	handleSectionNext: function() {
		var step = this.state.step + 1;
		if (step < this.props.steps.length) {
			this.setState({step: step});
		}
	},

	handleFocus: function(step) {
		window.setTimeout(function() {
			this.refs.content.getDOMNode().scrollLeft = 0;
		}.bind(this), 10);
		this.setState({step: step});
	},

	render: function() {
		var stepIndex = this.state.step;
		var steps = this.props.steps;
		var step = steps[stepIndex];

		var previous = steps[stepIndex - 1] || null;
		var next = steps[stepIndex + 1] || null;

		var components = steps.map(function(entry, index) {
			var component = entry.component;
			var ref = 'step' + index;

			var cls = Math.abs(index - stepIndex) < 2
				? index < stepIndex
					? 'prev'
					: index > stepIndex ? 'next' : 'curr'
				: 'ignore';

			var values = {};
			var states = Array.isArray(entry.states) ? entry.states : [entry.states];
			states.forEach(function(name) {
				values[name] = this.state[name];
			}, this);

			return (
				<section className={'step-' + cls} key={ref} onScroll={this.handleScroll}>
					<component className={cls} ref={ref} values={values} onChange={this.handleSectionChange} onSubmit={this.handleSectionNext} />
				</section>
			);
		}, this);

		return (
			<div className='page'>
				<header>
					<nav>
						<button className='btn btn-flat' disabled={!previous} onClick={this.handleSectionPrevious}>{previous && previous.title}</button>
						<h2 className='page-title'>{step.title}</h2>
						<button className='btn btn-flat' disabled={!next} onClick={this.handleSectionNext}>{next && next.title}</button>
					</nav>
				</header>
				<div ref='content' className='page-content wizard'>{components}</div>
			</div>
		);
	},

	focusInput: function() {
		var step = this.refs['step' + this.state.step];
		if (step && step.isMounted()) {
			var input = step.getDOMNode().querySelector('input[type=text]');
			if (input) {
				input.focus();
			}
		}
	},

	componentDidMount: function() {
		// this.focusInput();
	},

	componentDidUpdate: function() {
		// this.focusInput();
	}
});

var TopicStep = React.createClass({
	handleChange: function(event) {
		this.props.onChange({
			topic: event.target.value
		});
	},

	render: function() {
		return (
			<form onSubmit={this.props.onSubmit}>
				<label>
					<input type='text' className='lg' defaultValue={this.props.values.topic} onChange={this.handleChange} />
				</label>
			</form>
		);
	}
});

var AudienceStep = React.createClass({
	handleChange: function(event) {
		this.props.onChange({
			audience: event.target.value
		});
	},

	render: function() {
		return (
			<form onSubmit={this.props.onSubmit}>
				<p>Intended decision maker(s) or influencer(s).</p>
				<label>
					<input type='text' defaultValue={this.props.values.audience} onChange={this.handleChange} />
				</label>
			</form>
		);
	}
});


var ActionStep = React.createClass({
	handleChange: function(event) {
		this.props.onChange({
			action: event.target.value
		});
	},

	render: function() {
		return (
			<form onSubmit={this.props.onSubmit}>
				<p>You need to know what you want before you ask somebody to follow you.</p>
				<label>
					<input type='text' defaultValue={this.props.values.action} onChange={this.handleChange} />
				</label>
			</form>
		);
	}
});

var QuestionsStep = React.createClass({
	updateValue: function(key, value) {
		var questions = this.props.value.slice();
		if (value != null) {
			// Update existing entry
			if (!questions.some(function(question) {
				if (question.key != key) {
					return false;
				}
				question.value = value;
				return true;
			})) {
				// … or add a new entry for an unknown key
				questions.push({
					key: key,
					value: value
				});
			}
		} else {
			// Remove a question
			questions = questions.filter(function(question) {
				return question.key != key;
			});
		}
		this.props.onChange({
			questions: questions
		});
	},

	handleChange: function(key) {
		this.updateValue(key, this.refs[key].getDOMNode().value);
	},

	handleRemove: function(key) {
		this.updateValue(key, null);
	},

	render: function() {
		var questions = this.props.values.questions.slice();
		if (!questions.length || questions[questions.length - 1].value) {
			questions.push({
				key: Math.random().toString(16).substr(2),
				value: '',
				extra: true
			});
		}
		var inputs = questions.map(function(question, index) {
			return (
				<label key={question.key}>
					<input type='text' ref={question.key} defaultValue={question.value} placeholder='Another question …' onChange={this.handleChange.bind(this, question.key)} />
					<button className='btn btn-flat' onClick={this.handleRemove.bind(this, question.key)} disabled={!!question.extra}>⨯</button>
				</label>
			);
		}, this);
		return (
			<form onSubmit={this.props.onSubmit}>
				<p>Big picture questions that your audience will habe about your topic.</p>
				{inputs}
			</form>
		);
	}
});


var ProContraStep = React.createClass({
	handleChange: function() {
		this.props.onChange({
			motivation: this.refs.motivation.getDOMNode().value,
			resistance: this.refs.resistance.getDOMNode().value
		});
	},

	render: function() {
		return (
			<form onSubmit={this.props.onSubmit}>
				<p>What will stop them?</p>
				<label>
					<input type='text' ref='resistance' defaultValue={this.props.values.resistance} onChange={this.handleChange} />
				</label>
				<p>What will get them to do it?</p>
				<label>
					<input type='text' ref='motivation' defaultValue={this.props.values.motivation} onChange={this.handleChange} />
				</label>
			</form>
		);
	}
});

module.exports = WizardPage;
