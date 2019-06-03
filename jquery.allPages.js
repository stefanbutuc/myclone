$(function() {

	//- use a popup for tel: links (when device can't call)
    $("a[href^='tel:']").tel();

    //- enable Over Under for easy class-based "media queries"
    $("body").overUnder();

	//---- select2.js style all selects
	//$("select").select2();

	//- push footer to bottom of window by adding a div with the class "footerSpacer" right before the footer
	$(window).bind("ready load resize", pushFooter);

	// header
	$(window).on("scroll resize",function() {
		debounce(hideHeader(),250);
		debounce(scrollEffect(),250);
	});

	// mobile header
	$("a[href=#menu]").click(function(e) {
		var $this = $(this);
		if ($(".menu").hasClass("open")) {
			$(".menu").removeClass("open");
		} else {
			$(".menu").addClass("open");
		}
		e.preventDefault();
	});
	// click outside of menu to close menu
	$("body").click(function(e) {
		if ($(".menu.open").length && $(e.target).closest(".menu.open").length < 1) {
			$("a[href=#menu]").click();
		}
	});

	// scroll effect
	$(window).on("ready load resize",function() {
		debounce(queueScrollEffect(),250);
	});

	// make all case study blocks fully clickable
	$("section[id^=workID]").click(function(e) {
		var thisHref = $(this).find("a").attr("href");
		location.href = thisHref;
	});

	// make an entire element clickable for a link inside of it
	$(".clickable").css("cursor","pointer");
	$("body").on("click",".clickable",function() {
		var href = $(this).find("a").attr("href");
		location.href = href;
	});

	// VIDEO player
	$("video").click(function() {
		if (!$(this).hasClass("paused")) {
			$(this)[0].pause();
			$(this).addClass("paused");
		} else {
			$(this)[0].play();
			$(this).removeClass("paused");
		}
	}).siblings(".playIcon").click(function() {
		$(this).siblings("video").click();
	});

});

// pushes the .footer div to the bottom of the screen... fired above for window ready, load and resize events
function pushFooter() {
	$(".footerSpacer").height(0); //- remove .footerSpacer height for acurate calculations
	var browserHeight = $(window).height();
	var contentHeight = $("body").height();
	if (browserHeight > contentHeight) {
		var footerSpacerHeight = browserHeight-contentHeight;
		if (!$(".footerSpacer").length) { $(".footer").before("<div class='footerSpacer' />"); }
		$(".footerSpacer").height(footerSpacerHeight);
	}
}

// header stuff to debounce
var lastScrollVal = $(window).scrollTop();
var maxScroll = $("body").height() - $(window).height();
$(window).on("ready load resize",function() {
	maxScroll = $("body").height() - $(window).height();
});
function hideHeader() {
	var scrollVal = $(window).scrollTop();
	if ((scrollVal > 0 && scrollVal > lastScrollVal) || (scrollVal >= maxScroll && maxScroll > 0)) {
		$(".header").addClass("hidden");
		$(".subnav-services").removeClass("below"); // for case study subnav positions
		if ($(".menu").hasClass("open")) {
			$("a[href=#menu]").click();
		}
	} else {
		$(".header").removeClass("hidden");
		$(".subnav-services").addClass("below"); // for case study subnav positions
	}
	lastScrollVal = scrollVal;
}

// scroll effect to debounce
function queueScrollEffect() {
	var windowHeight = $(window).height();
	var scrollTop = $(window).scrollTop();
	$(".scrollEffect").each(function() {
		var $this = $(this);
		var thisTop = $this.offset().top;
		if (thisTop > windowHeight+scrollTop) {
			$this.addClass("queued");
		}
	});
}
function scrollEffect() {
	$(".scrollEffect,button,.button").each(function() {
		var $this = $(this);
		var thisTop = $this.offset().top;
		var scrollTop = $(window).scrollTop();
		var windowHeight = $(window).height();
		if (scrollTop+windowHeight > thisTop) {
			$this.removeClass("queued");
		} else {
			$this.addClass("queued");
		}
	});

	// homepage banner
	if ($(".bg-banner").length && $(window).scrollTop() < 1) { // $(".bg-banner").height()*.25
		$(".bg-banner").removeClass("dark");
	} else {
		$(".bg-banner").addClass("dark");
	}
}

// debounce function to fire scroll and resize events less often
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};