/*
Tel jQuery Plugin
Version 1
Dec 6th, 2012

Documentation: http://drewtotango.com/tel
Repository: https://github.com/drewbrolik/Tel

Copyright 2012 Drew Thomas

Dual licensed under the MIT and GPL licenses:
https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt
http://www.gnu.org/licenses/gpl.txt

This file is part of Tel.

Tel is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Tel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Tel.  If not, see <http://www.gnu.org/licenses/>.
*/

(function($) {

	$.fn.tel = function(additionalOptions) {
				
		var options = { //- set default options
			callback:function(phoneNumber) {
				alert(phoneNumber);
			}
		}
		
		options = $.extend(options, additionalOptions ); //- override default options with user-supplied options
		
		var isMobile = { // from http://www.abeautifulsite.net/blog/2011/11/detecting-mobile-devices-with-javascript/
			Android: function() {
				return navigator.userAgent.match(/Android/i);
			},
			BlackBerry: function() {
				return navigator.userAgent.match(/BlackBerry/i);
			},
			iOS: function() {
				return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			},
			Opera: function() {
				return navigator.userAgent.match(/Opera Mini/i);
			},
			Windows: function() {
				return navigator.userAgent.match(/IEMobile/i);
			},
			any: function() {
				return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
			}
		};
		
		var $This = $(this);
		
		if (!$This.is("a")) { $This = $This.find("a"); }
		
		$This.each(function() { //- do it for 'em all
			
			var $this = $(this);
			
			var thisHref = $this.attr("href");
			if (thisHref.substring(0,4) == "tel:" && !isMobile.any()) {
				$this.click(function() {
					options.callback(thisHref.replace("tel:",""));
					return false;
				});
			}
				
		});
		
		return this;
	};
	
})(jQuery);