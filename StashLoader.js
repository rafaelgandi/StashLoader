/* 
	StashLoader
	--------
	- Cache scripts in localStorage for less http requests.
	
	Inspired by:
		* https://addyosmani.com/basket.js/
		* http://www.stevesouders.com/blog/2011/03/28/storager-case-study-bing-google/
	
 */
var StashLoader = (function (window, undefined) {
	
	function StashLoader() {
		this.hasLocalStorage = !! window.localStorage;
		this.expireKey = 'stashloader_expire';
		// Caches expire after 1 hour //
		_expire.call(this); 
	}
	
	function _request(_script, _callback) {
		// See: https://gist.github.com/Xeoncross/7663273
		try {
			var x = new(window.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
			x.open('GET', _script, 1);
			x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			x.onreadystatechange = function () {
				x.readyState > 3 && _callback && _callback(x.responseText, x);
			};
			x.send();
		} catch (e) {
			window.console && console.log(e);
		}	
	}
	
	function _saveAsCache(_script) {
		_request(_script, function (scriptCode) {
			try { window.localStorage.setItem(_script, scriptCode); }
			catch(e) {
				// See: http://sunpig.com/martin/archives/2011/05/21/considerations-for-caching-resources-in-localstorage.html
				window.console.error('Can\'t store resource >>> ' + e.message);
			}	
		});
	}
	
	function _toSeconds(_ms) {
		return Math.ceil(parseInt(_ms, 10) / 1000);
	}
	
	function _expire() {
		if (! this.hasLocalStorage) { return; }
		var now = new Date(),
			expireTime = window.localStorage.getItem(this.expireKey),
			ONE_HOUR = 3600, // seconds
			seconds = 0;
		if (! expireTime) {
			window.localStorage.setItem(this.expireKey, now.getTime());
			return;
		}
		seconds = _toSeconds(now.getTime()) - _toSeconds(expireTime);
		if (seconds > ONE_HOUR) {
			// NOTE: This purges the whole localstorage data... sorry
			window.localStorage.clear();
		}
	}
	
	function _globalEval(_code) {
		// See: http://james.padolsey.com/jquery/#v=1.6.2&fn=jQuery.globalEval
		eval.call(window, _code);
	}
	
	StashLoader.prototype.load = function (_scripts) {
		var _this = this;
		_scripts.forEach(function (script) {
			if (!! window.localStorage.getItem(script) && _this.hasLocalStorage) {
				_globalEval(window.localStorage.getItem(script));
			}
			else {
				document.write("<script src='" + script + "'>\x3C/script>");
				_saveAsCache.call(_this, script);
			}
		});
	};
	
	return new StashLoader();	
})(window);