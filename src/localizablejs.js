/**
* LocalizableJs
*
* A simple, easy to use, DOM-inline, localization library
*
* @author Björn Wikström <bjorn@welcom.se>
* @license Apache License 2.0 <https://www.apache.org/licenses/LICENSE-2.0.html>
* @version 2.0
* @copyright Welcom Web i Göteborg AB 2015
*/
(function(name, definition) {
    if (typeof module != 'undefined') {
        module.exports = definition();
    } else if (typeof define == 'function' && typeof define.amd == 'object') {
        define(definition);
    } else {
        this[name] = definition();
    }
}('LocalizableJs', function () {
    
    /**
     * Local variables storing loaded dictionaries, current language and observers
     */
	var _dictionaries = {},
        _language = null,
        _callbacks = [];
    
    /**
     * Which DOM element attributes to listen to. These can be changed through
     * API methods.
     */
    var _domKeyAttribute = 'data-translate-key',
        _domParamsAttribute = 'data-translate-params';
    
    /**
     * Gets or sets the current language key, and notifies observers if
     * the language changes.
     * 
     * @param lang      {String}    A language matching a dictionary entry
     * @returns         {String}
     */
    var language = function (lang) {
        if (!!lang && lang != _language) {
            _language = lang;
            notify('language');
        }
        
        return _language;
    };
    
    /**
     * Gets or sets available dictionaries, and notifies observers if
     * the dictionaries change.
     * 
     * @param dicts     {Object}    A dictionary containing languages and translations
     * @returns         {Object}
     */
    var dictionaries = function (dicts) {
        if (!!dicts && dicts != _dictionaries) {
            _dictionaries = dicts;
            notify('dictionaries');
        }
        
        return _dictionaries;
    };
    
    /**
     * Notify all observers that a change has occurred.
     * 
     * @param type      {String}    The type of change
     * @returns         {Void}
     */
    var notify = function (type) {
        for (var i = 0; i < _callbacks.length; i++) {
            _callbacks[i].call(this, type);
        }
    };
    
    /**
     * Format a string with parameters;
     * 
     * format("Hello, {0}!", "Bear")
     * ->
     * "Hello, Bear!"
     * 
     * @param str       {String}    The string to be formatted
     * @param ...       {Array}     The rest of the parameters are passed as replacements
     * @returns         {String}
     */
    var format = function (str) {

        var parameters = Array.prototype.splice.apply(arguments, [1]);
        return str.replace(/\{\d+\}/g, function (match) {

            var index = parseInt(match.replace(/\{|\}/g, ''));
            
            if (parameters.length > index) {
                return parameters[index];
            }

            return '';

        });

    };
    
    /**
     * Translate a key for the current language, i.e. return a value
     * from the dictionary corresponding to current language and
     * the passed in key.
     * 
     * @param key       {String}    Translation key in dictionary
     * @returns         {String}
     */
    var translate = function (key) {

        var text = _dictionaries[_language][key],
            parameters = Array.prototype.splice.apply(arguments, [1]);
        
        if (!!text) {
            return format(text, parameters);
        }
        
        return '';

    };
    
    /**
     * Translate DOM nodes matching the attribute selectors
     * 
     * @param nodes     {Array}     A list of DOM nodes to be translated
     * @returns         {Void}
     */
    var translateNodes = function (nodes) {
        Array.prototype.forEach.call(nodes, function (node) {
            var key = node.getAttribute(_domKeyAttribute),
                params = !!node.getAttribute(_domParamsAttribute) ? node.getAttribute(_domParamsAttribute).split(',') : [];
            
            params.unshift(key);
            node.innerHTML = translate.apply(self, params);
        });
    };
    
    /**
     * Helper method to load a XML document with Ajax, to use as
     * dictionaries
     * 
     * @param path      {String}    A URI to the XML document
     * @param callback  {Function}  A callback function to handle the response
     * @returns         {Void}
     */
    var requestFile = function (path, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', path, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                callback(xhr.responseText);
            }
        };
        xhr.send();
    };
    
    /**
     * Helper method to parse a XML document and load it to memory as a
     * translation dictionary object
     * 
     * @param doc       {XMLDocument} The dictionary XML document
     * @returns         {Void}
     */
    var parseXmlDocument = function (doc) {
        var dictionaries = doc.getElementsByTagName("dictionary");
        Array.prototype.forEach.call(dictionaries, function (dict) {
            var language = dict.getAttribute("language");
            var translations = dict.getElementsByTagName("translation");
            
            _dictionaries[language] = {};
            
            Array.prototype.forEach.call(translations, function (translation) {
                var key = translation.getAttribute("key");
                _dictionaries[language][key] = translation.textContent;
            });
        });
    };
    
    return {
        /**
         * Read a XML document from path, parse it and set current language. Optionally
         * set the root node for translation DOM nodes.
         * 
         * @param xmlPath   {String}        A URI to a dictionary XML document
         * @param language  {String}        The default language to use for translations
         * @param rootNode  {DOMElement}    Root node for translation nodes
         */
        "read": function (xmlPath, language, rootNode) {
            _language = language;
            rootNode = rootNode || document.body;
            
            requestFile(xmlPath, function (text) {
                var parser, doc;
                if (!!window.DOMParser) {
                    parser = new DOMParser();
                    doc = parser.parseFromString(text, "application/xml");
                } else {
                    doc = new ActiveXObject("Microsoft.XMLDOM");
                    doc.async = false;
                    doc.loadXML(text);
                }
                
                parseXmlDocument(doc);
                notify("dictionaries");
            });
        },
        /**
         * Set default language, dictionaries to use, and optionally set the root node
         * for translation DOM nodes.
         * 
         * @param dictionaries  {Object}        The dictionaries containing all translations
         * @param language      {String}        The default language to use for translations
         * @param rootNode      {DOMElement}    Root node for translation nodes
         */
        "init": function (dictionaries, language, rootNode) {
            _language = language;
            _dictionaries = dictionaries;
            rootNode = rootNode || document.body;
            
            var nodes = rootNode.querySelectorAll('[' + _domKeyAttribute + ']');
            translateNodes(nodes);
        },
        /**
         * Set DOM element attributes to handle translations. Default values are:
         * 'data-translate-key' and 'data-translate-params'
         * 
         * @param key       {String}    Translation key attribute
         * @param params    {String}    Translation parameter attribute
         */
        "setAttributeSelectors": function (key, params) {
            _domKeyAttribute = key;
            _domParamsAttribute = params || _domParamsAttribute;
        },
        "language": language,
        "dictionaries": dictionaries,
        "translate": translate,
        /**
         * Do a manual translation for all DOM nodes under rootNode, or if left out
         * use document.body as root node
         * 
         * @param rootNode  {DOMElement}    Root node for translation nodes
         */
        "translateAll": function (rootNode) {
            rootNode = rootNode || document.body;
            
            var nodes = rootNode.querySelectorAll('[' + _domKeyAttribute + ']');
            translateNodes(nodes);
        },
        /**
         * Add a callback for when a change is made to dictionaries or active language
         * is changed.
         * 
         * @param fn    {Function}      The callback function
         */
        "addChangeListener": function (fn) {
            _callbacks.push(fn);
        },
        /**
         * Remove a callback from the callback list, so the listener is no longer
         * notified of any changes
         * 
         * @param fn    {Function}      The earlier registered callback function
         */
        "removeChangeListener": function (fn) {
            var index = -1;
            for (var i = 0; i < _callbacks.length; i++) {
                if (_callbacks[i] == fn) {
                    index = i;
                    break;
                }
            }
            
            if (index >= 0) {
                delete _callbacks[index];
                _callbacks.splice(index, 1);
            }
        }
    };
    
}));