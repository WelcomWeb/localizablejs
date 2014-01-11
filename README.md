LocalizableJs
=============

## About
LocalizableJs is a small library to enable localized web pages, marked up in the DOM tree. It's fast and leaves a small footprint, and translations are instant. Please see the [example files](https://github.com/WelcomWeb/localizablejs/tree/master/examples) for a demo.

## Example

### index.html

	<!doctype html>
	<html>
		<head>
			<meta charset="utf-8" />
			<title>LocalizableJs - An example</title>
			<script src="../localizable-1.0-min.js"></script>
			<script>

				var dictionary = {
					'en-US': {
						"WelcomeMessage": "Welcome, {0}!"
					},
					'sv-SE': {
						"WelcomeMessage": "Välkommen, {0}!"
					},
					'es-ES': {
						"WelcomeMessage": "¡Bienvenido, {0}!"
					}
				};

				window.onload = function () {

					var localizer = new LocalizableJs(dictionary);
					localizer.auto();

					document.querySelector('button[data-lang="en-US"]').onclick = function () {
						localizer.language('en-US');
						localizer.auto(true);
					};
					document.querySelector('button[data-lang="sv-SE"]').onclick = function () {
						localizer.language('sv-SE');
						localizer.auto(true);
					};
					document.querySelector('button[data-lang="es-ES"]').onclick = function () {
						localizer.language('es-ES');
						localizer.auto(true);
					};

				};

			</script>
		</head>
		<body>
			<h1 data-translation="WelcomeMessage" data-translation-parameters="Guest"></h1>
			<button data-lang="en-US">English</button>
			<button data-lang="sv-SE">Svenska</button>
			<button data-lang="es-ES">Español</button>
		</body>
	</html>

Happy coding!

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/556eec1d7e717b681375098971bea39a "githalytics.com")](http://githalytics.com/WelcomWeb/localizablejs)