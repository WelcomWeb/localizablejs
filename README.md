# LocalizableJs

### About
LocalizableJs is a small library to enable dynamically localized web pages, marked up in the DOM tree. It's fast and leaves a small footprint, and translations are instant. It's also available as a React component, giving the ability to easily have localized single page apps.

### Installation
LocalizableJs supports CommonJS, AMD or simple script tag injection. It's also available as a NPM package, install via

    npm install --save-dev localizablejs

or:

[Download development version](https://raw.githubusercontent.com/WelcomWeb/localizablejs/master/dist/localizablejs-2.0.js) (10KB)
[Download minified production version](https://raw.githubusercontent.com/WelcomWeb/localizablejs/master/dist/localizablejs-2.0.min.js) (2KB)

### Usage
LocalizableJs looks for DOM nodes with the default attribute name of `data-translate-key`. The value of that attribute should match a translation key in your dictionaries. If an attribute by the name `data-translate-params` is available, the translation can have formatting parameters.

### Quick example

The DOM node

    <div data-translate-key="WelcomeMessage" data-translate-params="Name"></div>

and JavaScript

    var dictionaries = {
		"en-US": {
			"WelcomeMessage": "Hello {0}!"
		},
		"sv-SE": {
			"WelcomeMessage": "Hejsan {0}!"
		}
	};
	LocalizableJs.init(dictionaries, "en-US");

will result in the following output

    Hello Name!

Change the language and translate all nodes

    LocalizableJs.language("sv-SE");
	LocalizableJs.translateAll();

and the output will instantly become

    Hejsan Name!

### React
LocalizableJs also ships as a React component, with attached listeners for language or dictionaries change.

    var React = require('react'),
		LocalizableJs = require('localizablejs');
	
	var dictionaries = {
		"en-US": {
			"WelcomeMessage": "Hello {0}!"
		},
		"sv-SE": {
			"WelcomeMessage": "Hejsan {0}!"
		}
	};
	
	var Header = React.createClass({
		componentDidMount: function () {
			LocalizableJs.init(dictionaries, "en-US");
		},
		doSetLanguage: function (language) {
			LocalizableJs.language(language);
		},
		render: function () {
			
			return (
				<header>
					<button onClick={this.doSetLanguage.bind(this, 'en-US')}>English</button>
					<button onClick={this.doSetLanguage.bind(this, 'sv-SE')}>Svenska</button>
				</header>
			);
			
		}
	});
	
	-----
	
	var React = require('react'),
		LocalizableElement = require('localizablejs/react');
	
	var MyComponent = React.createClass({
		render: function () {
		
			var params = ["Name"];
		
			return (
				<div>
					<LocalizableElement translationKey={"WelcomeMessage"} parameters={params} />
				</div>
			);
			
		}
	});

### External translation dictionaries
More than often are translation sources not available directly in the JavaScript files, but in external translation files. LocalizableJs supports external XML translation files, in the following format:

    <?xml version="1.0" encoding="UTF-8"?>
	<dictionaries>
		<dictionary language="en-US">
			<translation key="WelcomeMessage">Hello {0}!</translation>
		</dictionary>
		<dictionary language="sv-SE">
			<translation key="WelcomeMessage">Hejsan {0}!</translation>
		</dictionary>
	</dictionaries>

To initialize LocalizableJs with an external translation file, simply pass the URI of the file as a parameter to the `read` method (and set a default language):

    LocalizableJs.read("/translations/dictionaries.xml", "en-US");

### API methods

`LocalizableJs.init(dictionaries, defaultLanguage [, rootNode = document.body])`

Initialize LocalizableJs with JavaScript dictionaries


`LocalizableJs.read(xmlFileUri, defaultLanguage [, rootNode = document.body])`

Initialize LocalizableJs with an external dictionaries source


`LocalizableJs.setAttributeSelectors(key [, params])`

Set new DOM attributes to listen to, defaults to `data-translate-key` and `data-translate-params`


`LocalizableJs.language([lang])`

Set or get the current language


`LocalizableJs.dictionaries([dictionaries])`

Set or get dictionaries


`LocalizableJs.translate(key)`

Translate a single key (this method returns the result, not writing it to the DOM)


`LocalizableJs.translateAll([rootNode = document.body])`

Translate all DOM nodes under the optionally specified root node


`LocalizableJs.addChangeListener(fn)`

Add an observer for when current language or dictionaries change


`LocalizableJs.removeChangeListener(fn)`

Remove an observer


Happy coding!