var React = require('react'),
	LocalizableJs = require('../src/localizablejs');

var LocalizableElement = React.createClass({
	propTypes: {
		translationKey: React.PropTypes.string,
		parameters: React.PropTypes.array
	},
	getInitialState: function () {
		return { language: LocalizableJs.language(), dictionaries: LocalizableJs.dictionaries() };
	},
	componentDidMount: function () {
		LocalizableJs.addChangeListener(this.update);
	},
	componentWillUnmount: function () {
		LocalizableJs.removeChangeListener(this.update);
	},
	update: function () {
		this.setState({ language: LocalizableJs.language(), dictionaries: LocalizableJs.dictionaries() });
	},
	render: function () {
		
		var translation = LocalizableJs.translate.call(this, this.props.translationKey, this.props.parameters || []);
		
		if (translation == '' && this.props.defaultText) {
			translation = this.props.defaultText;
		}
		
		return React.createElement('span', this.props, translation);
		
	}
});

module.exports = LocalizableElement;