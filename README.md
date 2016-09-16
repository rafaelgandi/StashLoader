# StashLoader
Cache scripts in localStorage for less http requests.

## Inspired by:
	* https://addyosmani.com/basket.js/
	* http://www.stevesouders.com/blog/2011/03/28/storager-case-study-bing-google/

```JavaScript

StashLoader.load([
	'http://someurl.local/js/jquery-1.11.2.min.js', // jQuery
	'http://someurl.local/js/jquery-plugins/bootstrap.js', // BOOTSTRAP
	'http://someurl.local/js/third_party/require.js' // Require JS (http://requirejs.org/)
]);

```

