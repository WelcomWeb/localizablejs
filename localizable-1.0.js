/**
* LocalizableJs
*
* A simple, easy to use, DOM-inline, localization library
*
* @author Björn Wikström <bjorn@welcom.se>
* @license LGPL v3 <http://www.gnu.org/licenses/lgpl.html>
* @version 1.0
* @copyright Welcom Web i Göteborg AB 2013
*/
;(function (window, document, undef) {

    /*
     * If LocalizableJs is already loaded, don't load it again
     */
    if (typeof window.LocalizableJs !== typeof undef) {
        return;
    }

    /*
     * Constructor, that takes a full dictionary as parameter
     *
     * An example of such a dictionary:
     * var dictionary = {
     *   'en-US': {
     *     "WelcomeMessage": "Welcome, {0}!"
     *   },
     *   'sv-SE': {
     *     "WelcomeMessage": "Välkommen, {0}!"
     *   },
     *   'es-ES': {
     *     "WelcomeMessage": "¡Bienvenido, {0}!"
     *   }
     * };
     *
     * @param dictionary {Object} A dictionary object
     * @returns {Void}
     */
    var localizer = function (dictionary, defaultLanguage) {

        this._dictionary = dictionary;
        this._language = defaultLanguage || 'en-US';

        this._selectors = {
            'key': 'data-translation',
            'params': 'data-translation-parameters'
        };

        /*
         * To be able to select nodes in the DOM we rely on a CSS Selector API,
         * and by default we use the browser supported `querySelectorAll`
         */
        this.__ = document.querySelectorAll;

    };

    /*
     * If legacy browsers should be supported, i.e. those that doesn't
     * support `document.querySelectorAll`, an external library could be
     * used - such as Sizzle, jQuery or MooTools.
     *
     * @param lib {Object} A third party CSS selector library
     * @returns {Void}
     */
    localizer.prototype.setSelectorApi = function (lib) {
        this.__ = lib;
    };

    /*
     * Change the DOMElement attribute names, for the selectors.
     *
     * @param keyAttribute {String} A name for the key attribute
     * @param paramsAttribute {String} A name for the parameters attribute
     * @returns {Object} The current selectors
     */
    localizer.prototype.selectors = function (keyAttribute, paramsAttribute) {
        
        if (!!keyAttribute) {
            this._selectors = {
                'key': keyAttribute,
                'params': paramsAttribute
            };
        }

        return this._selectors;

    };

    /*
     * Set the language that text should be generated from,
     * or get the current language by leaving out the
     * `language` parameter.
     *
     * @param language {String} Optional, the dictionary language key
     * @returns {String} The current language used
     */
    localizer.prototype.language = function (language) {

        if (!!language && this._dictionary[language]) {
            this._language = language;
        }

        return this._language;

    };

    /*
     * Set a new dictionary for the localizer, or get
     * the current dictionary in use by leaving out the
     * `dictionary` parameter.
     *
     * @param dictionary {Object} A dictionary object
     * @returns {Object} The current dictionary in use
     */
    localizer.prototype.dictionary = function (dictionary) {

        if (!!dictionary && Object.prototype.toString.call(dictionary) === '[object Object]') {
            this._dictionary = dictionary;
        }

        return this._dictionary[this._language];

    };

    /*
     * Helper method to format strings. Example:
     *
     * var raw = "Hello {0}, thank you for the {1}";
     * var formatted = localizer.format(raw, "Björn", "fish");
     * // formatted == "Hello Björn, thank you for the fish";
     *
     * @param string {String} The raw string with and without placeholders
     * @returns {String} The formatted string
     */
    localizer.prototype.format = function (string) {

        var parameters = Array.prototype.splice.apply(arguments, [1]);
        return string.replace(/{\d+}/g, function (match) {

            var index = parseInt(match.replace(/\{|\}/g, ''));
            
            if (parameters.length > index) {
                return parameters[index];
            }

            return '';

        });

    };

    /*
     * Get a translation in the current dictionary, with the current set
     * language by the specified key. Uses `localizer.format` to parse
     * the result, so the string can contain placeholders and the function
     * can be called with additional arguments to produce the result string.
     *
     * @param key {String} A key in the dictionary
     * @returns {String} A formatted string
     */
    localizer.prototype.translate = function (key) {

        var text = this._dictionary[this._language][key],
            parameters = Array.prototype.splice.apply(arguments, [1]);
        
        if (!!text) {
            return this.format(text, parameters);
        }
        
        return '';

    };

    /*
     * Automatically translate nodes in the DOM, using keys and parameters from
     * the DOMElements attribute list.
     * Example:
     * <span data-translation="WelcomeMessage" data-translation-parameters="Fish"></span>
     * generates ->
     * <span data-translation="WelcomeMessage" data-translation-parameters="Fish">Welcome, Fish!</span>
     * (if the current language is english)
     *
     * @param force {Boolean} Optional, force a reload of all occurrences in the DOM
     * @returns {Void}
     */
    localizer.prototype.auto = function (force) {

        var attr = this._selectors.key,
            params = this._selectors.params;

        if (!!force) {

            var inactives = this.__.call(window.document, '[data-translated]');
            Array.prototype.forEach.call(inactives, function (node) {
                node.setAttribute(attr, node.getAttribute('data-translated'));
            });

        }

        var items = this.__.call(window.document, '[' + attr + ']'),
            self = this;
        
        Array.prototype.forEach.call(items, function (node) {

            var key = node.getAttribute(attr),
                parameters = node.getAttribute(params) ? node.getAttribute(params).split(',') : [];

            parameters.unshift(key);
            node.innerHTML = self.translate.apply(self, parameters);

            if (!!node.getAttribute('data-translation-no-reoccurances')) {
                node.setAttribute('data-translated', key);
                node.removeAttribute(attr);
            }

        });

    };

    /*
     * Attach LocalizableJs to the global namespace
     */
    window.LocalizableJs = localizer;

})(window, window.document);