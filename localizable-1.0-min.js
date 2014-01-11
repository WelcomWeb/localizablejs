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
;(function(e,t,n){if(typeof e.LocalizableJs!==typeof n){return}var r=function(e,n){this._dictionary=e;this._language=n||"en-US";this._selectors={key:"data-translation",params:"data-translation-parameters"};this.__=t.querySelectorAll};r.prototype.setSelectorApi=function(e){this.__=e};r.prototype.selectors=function(e,t){if(!!e){this._selectors={key:e,params:t}}return this._selectors};r.prototype.language=function(e){if(!!e&&this._dictionary[e]){this._language=e}return this._language};r.prototype.dictionary=function(e){if(!!e&&Object.prototype.toString.call(e)==="[object Object]"){this._dictionary=e}return this._dictionary[this._language]};r.prototype.format=function(e){var t=Array.prototype.splice.apply(arguments,[1]);return e.replace(/{\d+}/g,function(e){var n=parseInt(e.replace(/\{|\}/g,""));if(t.length>n){return t[n]}return""})};r.prototype.translate=function(e){var t=this._dictionary[this._language][e],n=Array.prototype.splice.apply(arguments,[1]);if(!!t){return this.format(t,n)}return""};r.prototype.auto=function(t){var n=this._selectors.key,r=this._selectors.params;if(!!t){var i=this.__.call(e.document,"[data-translated]");Array.prototype.forEach.call(i,function(e){e.setAttribute(n,e.getAttribute("data-translated"))})}var s=this.__.call(e.document,"["+n+"]"),o=this;Array.prototype.forEach.call(s,function(e){var t=e.getAttribute(n),i=e.getAttribute(r)?e.getAttribute(r).split(","):[];i.unshift(t);e.innerHTML=o.translate.apply(o,i);if(!!e.getAttribute("data-translation-no-reoccurances")){e.setAttribute("data-translated",t);e.removeAttribute(n)}})};e.LocalizableJs=r})(window,window.document)