// JavaScript Document
// Leverage v4

(function( $ ){

//-------------------------------------------/ Pop Ups /--------------------------------------------------//

// Dim screen (with .dimmer) and fade in target div with 'data' as content
// Works well as the callback for an ajax function // TODO: update this comment (popUp function)

$.fn.popUp = function(additionalOptions) {
	
	//- set default options
	var options = { // defaults
		data:"",
		callback:false,
		dimScreen:true,
		closeText:"( X )",
		autoClose:false // or set to a number of miliseconds
	}

	//- give the option to call the plugin with just certain parameters... as a shorthand and a fallback to the older .popUp function
	if (arguments.length == 2) { //- option to specify just "data" and "callback" as two parameters, instead of an object
		additionalOptions = { data:arguments[0],callback:arguments[1] }
	} else if (typeof arguments[0] == "string") { //- option to specify just "data" as a single parameter, instead of an object
		additionalOptions = { data:arguments[0] }
	}

	//- merge user-specified options into default options
	options = $.extend(options, additionalOptions ); //- override default options with user-supplied options

	//- variable for later
	var $thisPopUp = $(this);
	
	//- dim screen so the popUp stands out more
	if (options.dimScreen) { $(".dimmer").fadeIn(); } //- .dimmer class adds a "fullscreen" div between the site and the popUp

	//- set html of popUp and add a "close" button
	$thisPopUp.html("<div class='close'><a href='#closePopUp'>"+options.closeText+"</a></div>"+options.data);
	
	//- set some positioning css and fade popUp in
	/* width and marginLeft are for horizontal centering
	   scroll value is for vertical centering */
	var thisWidth = $thisPopUp.outerWidth();
	var scrollVal = $(window).scrollTop();
	$thisPopUp.css({"marginLeft":"-"+thisWidth/2+"px","top":scrollVal+"px"}).fadeIn(function() {
		//- call the callback, if it's a function
		if (typeof options.callback == 'function') {
			options.callback.call(this, options.data);
		}																							  
	});	
	
	//- make close button close the popUp
	$thisPopUp.find("a[href=#closePopUp]").click(function() {
		$thisPopUp.fadeOut(function() { $(".dimmer").fadeOut(function() { $thisPopUp.html(""); }); });
		return false;
	});
	$(".dimmer").click(function() {
        $thisPopUp.fadeOut(function() { $(".dimmer").fadeOut(function() { $thisPopUp.html(""); }); });
        return false;
    });

	//- auto close if it's set
	if (options.autoClose) {
		var closeTimeout = setTimeout(function() {
			$thisPopUp.find("a[href=#closePopUp]").click();
		},options.autoClose);
	}
}

//-------------------------------------------/ Confirm-Style Pop Ups /--------------------------------------------------//

// hitting cancel returns false, hitting OK runs the callback function

$.fn.popUpConfirm = function(data,callback) {
	
	var $thisPopUp = $(this);
	$(".dimmer").fadeIn(function() {
		
		$thisPopUp.html(data+"<p style='text-align:center'><a class='confirmOK button' href='#confirmOK'>OK</a> <a class='confirmCancel button' href='#confirmCancel'>Cancel</a></p>"); // "<p class='close'><a href='#closePopUp'>X</a></p>"+
		
		var thisWidth = $thisPopUp.outerWidth();
		
		var scrollVal = $(window).scrollTop();
		
		$thisPopUp.css({"marginLeft":"-"+thisWidth/2+"px"}).fadeIn(function() {
			$thisPopUp.animate({"top":scrollVal+"px"},500);
		});
		
		$thisPopUp.find(".confirmOK").click(function() {
			
			$thisPopUp.fadeOut(function() {
				$(".dimmer").fadeOut(function() {
					
				});
				callback.call(this, data);
			});
			return false;
		});
		
		$thisPopUp.find(".confirmCancel").click(function() {
			$thisPopUp.fadeOut(function() {
				$(".dimmer").fadeOut();
			});
			return false;
		});
		
		var returnVal;
		
	});
	
	$thisPopUp.find("a[href=#closePopUp]").live("click",function() {
		$thisPopUp.fadeOut(function() { $(".dimmer").fadeOut(function() { $thisPopUp.html(""); }); });
		return false;
	});
}

//-------------------------------------------/ Confirm-Style Pop Ups /--------------------------------------------------//
	// hitting cancel returns false, hitting OK runs the callback function
	/*$.fn.popUpConfirm = function(data,callback,okText,cancelText) {
		
		if (!okText) { okText = "OK"; }
		if (!cancelText) { cancelText = "Cancel"; }
		
		var $thisPopUp = $(this);
		$(".dimmer").fadeIn(100,function() {
			
			$thisPopUp.html(data+"<div style='text-align:center' class='actionButtons clearfix'><div class='leftButton'><a class='confirmOK' href='#confirmOK'><button type='button'>"+okText+"</button></a></div><div class='rightButton'><a class='confirmCancel' href='#confirmCancel'><button type='button'>"+cancelText+"</button></a></div></div>"); // "<p class='close'><a href='#closePopUp'>X</a></p>"+
			
			var thisWidth = $thisPopUp.outerWidth();
			var scrollVal = $(window).scrollTop();
			
			$thisPopUp.css({"marginLeft":"-"+thisWidth*.5+"px"}).fadeIn(250,function() {
				$thisPopUp.animate({"top":scrollVal+"px"},200);
			});
			
			$thisPopUp.find(".confirmOK").click(function() {
				$thisPopUp.fadeOut(250,function() {
					$(".dimmer").fadeOut(250);
					callback.call(this, data);
				});
				return false;
			});
			
			$thisPopUp.find(".confirmCancel").click(function() {
				$thisPopUp.fadeOut(250,function() {
					$(".dimmer").fadeOut(250);
				});
				return false;
			});
						
		});
		
		$thisPopUp.find("a[href=#closePopUp]").click(function() {
			$thisPopUp.fadeOut(250,function() { $(".dimmer").fadeOut(250) });
			return false;
		});
		
		return this;
	}*/


//----------------------------------/ Smart Input /-----------------------------------------------//

// Input clears when clicked and returns to original value when blurred

$.fn.smartInput = function() {
	$(this).each(function() {
		var originalValue = $(this).val();
		$(this).addClass("smartInputStart").focus(function() {
			if ($(this).val() == originalValue) {
				$(this).removeClass("smartInputStart").val("");
			}
		}).blur(function() {
			if ($(this).val() == "") {
				$(this).addClass("smartInputStart").val(originalValue);	
			}
		});
	});
	
	return this;
}

//----------------------------------/ Validate Email /-----------------------------------------------//

// validate email in real time

$.fn.validateEmail = function() {
	
	return this.each(function() {
		$this = $(this);
		$this.keyup(function() {
			var thisVal = $this.val();
			if (thisVal.indexOf("@") < 1 || thisVal.indexOf(".") < 1) {
				$this.addClass("requiredRed");
			} else {
				$this.removeClass("requiredRed");
			}
		});
		$this.closest("form").submit(function() {
			var thisVal = $this.val();
			var returnVal = true;
			if (thisVal.indexOf("@") < 1 || thisVal.indexOf(".") < 1) {
				$this.addClass("requiredRed");
				alert("That email isn't valid");
				returnval = false;
				return false;
			}
			return returnVal;
		});
	});
	
}

//----------------------------------/ Character Count /-----------------------------------------------//

// Set character limit, but let users keep typing with an error message

// update character count
$.fn.charCount = function(count) {
	$(this).after("<span class='charcountSpan' style='padding-left:6px'></span>");
	$(this).keyup(function() {
		var textcopy = $(this).val();
		var textcopyCount = textcopy.length;
		var $thisSpan = $(this).next("span.charcountSpan");
		$thisSpan.text(textcopyCount+"/"+count);
		if (textcopyCount > count) {
			$thisSpan.css({"color":"#990000"});
		} else {
			$thisSpan.css({"color":"#000"});
		}
	});
	
	return this;
}

//----------------------------------/ Create Permalink /-----------------------------------------------//

// Make Reader Friendly URL (Permalink)
// Call this on a form

$.fn.createPermalink = function(input,output) {
	
	return this.each(function() {
		var $thisForm = $(this);
		$thisForm.find("input[name="+input+"],input[name="+output+"]").keyup(function() {
			var origVal = $(this).val();
			permaVal = origVal.replace(/ /g,"-");
			permaVal = permaVal.replace(/\.|,|\/|\?|'|\!/g,"");
			permaVal = permaVal.replace(/&/g,"and");
			$thisForm.find("input[name="+output+"]").val(permaVal);
		});
	});
}

//----------------------------------/ Confirm Password /-----------------------------------------------//

// Confirm Password
// Call this on a form

$.fn.confirmPassword = function(password,confirm_password) {
	
	var passwordValue;
	var confirmValue;
	
	this.each(function() {
		var $thisForm = $(this);
		var t;
		var noDelay = false;
		$thisForm.find("input[name="+password+"],input[name="+confirm_password+"]").keyup(function() {
			clearTimeout(t);
			passwordValue = $thisForm.find("input[name="+password+"]").val();
			confirmValue = $thisForm.find("input[name="+confirm_password+"]").val();
			if (passwordValue == confirmValue) {
				$thisForm.find("input[name="+password+"],input[name="+confirm_password+"]").removeClass("requiredRed");
				noDelay = true; // next time, turn red instantly
			} else {
				if (noDelay) { d = 0; } else { d = 1000; } // either turn input red in one second or instantly
				t = setTimeout(function() {
					$thisForm.find("input[name="+password+"],input[name="+confirm_password+"]").addClass("requiredRed");
					noDelay = false; // from now on, turn red after a second
				},d);
			}
		});
	});
	
	this.submit(function() {
		if (passwordValue !== confirmValue) {
			alert("Your passwords don't match!");
			return false;
		}
	});
	
	return this;
}

//----------------------------------/ Required Fields /-----------------------------------------------//

// Call this on a form. Set any fields in a form with the class 'required' as required
// one parameter is a jQuery path to the element to place the asterisk after

$.fn.required = function(asteriskStyle) { // path to asterisk does NOT work yet
	var returnTrue;
	
	// either add a * after the input or append it to argument
	if (arguments[0]) {
		asteriskStyle = arguments[0];	
	} else {
		asteriskStyle = { "color":"#ca0202","position":"absolute","marginLeft":"0.5%" }
	}
	
	return this.each(function() {
		var $thisForm = $(this);
		
		$thisForm.find(".required").each(function() { //---- place asterisk
			
			if ($(this).next("div.chzn-container").length) {
				$(this).next("div.chzn-container").after("<span>*</span>").next("span").css(asteriskStyle);
			} else {
				$(this).after("<span>*</span>").next("span").css(asteriskStyle); // style='color:#CA0202; position:absolute; margin-left:-10px;'
			}
			
		});
		
		$thisForm.submit(function() { //---- prevent submit and add messaging if fields are not filled out
			$(this).find(".required").each(function() {
				//returnTrue = true;
				$(this).removeClass("requiredRed");
				if ( ($(this).val() == "" || $(this).hasClass("smartInputStart")) || ($(this).hasClass("chzn-done") && $(this).val() == null) ) {
					$(this).addClass("requiredRed");
					//returnTrue = false;
				}
			});
			//if (!returnTrue) {
			if ($thisForm.find(".requiredRed").length) {
				return false;
			}
		});
	});
}


//----------------------------------/ Smart Form /-----------------------------------------------//

// This bundles a number of form plugins into one plugin that is called on the form and uses classes to add plugins to specifc elements
// included plugins/classes:
//
// smartInput/.smartInput | smartPassword/.smartPassword | required/.required | validateEmail/.validateEmail
//

$.fn.smartForm = function() {
	
	var longestLabel;
	return this.each(function() {
		
		var $thisForm = $(this);
		
		if ($thisForm.hasClass("sidebyside")) { //---- format labels
			longestLabel = 0;
			$thisForm.find("label").css({"display":"inline-block","textAlign":"right"}).each(function() {
				var thisLabel = $(this).outerWidth();
				if (thisLabel > longestLabel) {
					longestLabel = thisLabel;	
				}
			});
			$thisForm.find("label").css({"width":longestLabel+10+"px"}); //---- this probably won't work in IE 7 and below because of the inline-block
		}
		
		if ($thisForm.hasClass("stacked")) {
			$thisForm.find("label").each(function() {
				$(this).css({"display":"block","marginTop":"1%"});	
			});
			$thisForm.find("label:first").css({"marginTop":"0px"});
		}
		
		$thisForm.required();
		$thisForm.find(".smartInput").each(function() { $(this).smartInput(); });
		$thisForm.find(".smartPassword").each(function() { $(this).smartPassword(); });
		$thisForm.find(".validateEmail").each(function() { $(this).validateEmail(); });
	});
}

//----------------------------------/ Image Loader /-----------------------------------------------//

// Hides images and shows a loading icon until the image is loaded
//

$.fn.loadImage = function() {
	
	return this.each(function() {
		
		var $this = $(this);
		$this.prepend("<img src='images/ajax-loader.gif' style='width:16px; height:16px;' />");
		$this.find("img:last").hide().load(function() {
			if ($(this).parent("a").length) {
				var $thisImg = $(this).parent("a").prev("img");
				var $nextImg = $(this);
			} else {
				var $thisImg = $(this).prev("img");
				var $nextImg = $(this);
			}
			$thisImg.fadeOut(function() {
				$nextImg.fadeIn();
			});
		});
		
	});
}

})( jQuery ); // this closes everything in the whole document


//--------/ other stuff... /-----------//
$(function() {
	//---- image hover with data-hover attribute
	// any image with an attribute 'data-hover' will show the data-hover image on rollover, and revert to the original image on rollout
	$("body").on("mouseenter","img[data-hover]",function() {
		if (!$(this).parents("a").length) {
			var thisHover = $(this).attr("data-hover");
			var thisSrc = $(this).attr("src");
			$(this).attr({"src":thisHover,"data-hover":thisSrc});
		}
	}).on("mouseleave","img[data-hover]",function() {
		if (!$(this).parents("a").length) {
			var thisHover = $(this).attr("data-hover");
			var thisSrc = $(this).attr("src");
			$(this).attr({"src":thisHover,"data-hover":thisSrc});
		}
	});
	//---- show hover state when inside of an a tag (and user hovers over the rest of the a tag, outside of the image)
	$("body").on("mouseenter","a:has(img[data-hover])",function() {
		var thisHover = $(this).find("img[data-hover]").attr("data-hover");
		var thisSrc = $(this).find("img[data-hover]").attr("src");
		$(this).find("img[data-hover]").attr({"src":thisHover,"data-hover":thisSrc});
	}).on("mouseleave","a:has(img[data-hover])",function() {
		var thisHover = $(this).find("img[data-hover]").attr("data-hover");
		var thisSrc = $(this).find("img[data-hover]").attr("src");
		$(this).find("img[data-hover]").attr({"src":thisHover,"data-hover":thisSrc});
	});
});

//---------/ traditinal functions /-------------//
function setCookie(c_name,value,exdays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name) {
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++) {
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name) {
			return unescape(y);
		}
	}
}