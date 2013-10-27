/**
 * @name        jQuery FullScreen Plugin
 * @author      Martin Angelov, Morten Sjøgren, Joseph Turner
 * @version     1.2
 * @url         http://tutorialzine.com/2012/02/enhance-your-website-fullscreen-api/
 * @license     MIT License
 */

/*jshint browser: true, jquery: true */
(function($){
	"use strict";

	// These helper functions available only to our plugin scope.
	function supportFullScreen(){
		var doc = document.documentElement;

		return ('requestFullscreen' in doc) ||
				('mozRequestFullScreen' in doc && document.mozFullScreenEnabled) ||
				('webkitRequestFullScreen' in doc);
	}

	function requestFullScreen(elem){
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullScreen) {
			elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	}

	function fullScreenStatus(){
		return document.fullscreen ||
				document.mozFullScreen ||
				document.webkitIsFullScreen ||
				false;
	}

	function cancelFullScreen(){
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		}
	}

	function onFullScreenEvent(callback){
		$(document).on("fullscreenchange mozfullscreenchange webkitfullscreenchange", function(){
			// The full screen status is automatically
			// passed to our callback as an argument.
			callback(fullScreenStatus());
		});
	}

	// Adding a new test to the jQuery support object
	$.support.fullscreen = supportFullScreen();

	// Creating the plugin
	$.fn.fullScreen = function(props){
		if(!$.support.fullscreen || this.length !== 1) {
			// The plugin can be called only
			// on one element at a time

			return this;
		}

		if(fullScreenStatus()){
			// if we are already in fullscreen, exit
			cancelFullScreen();
			return this;
		}

		// You can potentially pass two arguments: a color
		// for the background and a callback function

		var options = $.extend({
			'background'      : '#111',
			'callback'        : $.noop( )
		}, props),

		elem = this,

		// This temporary div is the element that is
		// actually going to be enlarged in full screen

		fs = elem;

		requestFullScreen(fs.get(0));

		elem.cancel = function(){
			cancelFullScreen();
			return elem;
		};

		onFullScreenEvent(function(fullScreen){
			if(!fullScreen){
				// We have exited full screen.
			  // Detach event listener
			  $(document).off( 'fullscreenchange mozfullscreenchange webkitfullscreenchange' );
			}
			// Calling the user supplied callback
			if(options.callback) {
        options.callback(fullScreen);
      }
		});

		return elem;
	};

	$.fn.cancelFullScreen = function( ) {
			cancelFullScreen();

			return this;
	};
}(jQuery));
