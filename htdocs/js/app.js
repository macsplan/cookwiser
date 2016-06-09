$(document).ready(function(){

  // jQuery for page scrolling feature - requires jQuery Easing plugin
  jQuery('a.page-scroll').bind('click', function(event) {
    var $anchor = jQuery(this);
    jQuery('html, body').stop().animate({
        scrollTop: jQuery($anchor.attr('href')).offset().top - 78
    }, 1500, 'easeInOutExpo');
    event.preventDefault();
  });

  // toggle top nav items
  jQuery("a[data-toggle=\"tab\"]").click(function(e) {
    e.preventDefault();
    jQuery(this).tab("show");
  });

  // Closes the Responsive Menu on Menu Item Click
  jQuery('.navbar-collapse ul li a').click(function() {
    jQuery('.navbar-toggle:visible').click();
  });

  // cbpScroll code
  // --------------

  var docElem = document.documentElement,
		header = document.querySelector( '.navbar-fixed-top' ),
		didScroll = false,
    showLogoOn = 450;

});
