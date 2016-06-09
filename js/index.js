Template.index.rendered = function (){
  $(document).ready(function(){

    // -- start

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
      var $anchor = $(this);
      $('html, body').stop().animate({
          scrollTop: $($anchor.attr('href')).offset().top - 78
      }, 1500, 'easeInOutExpo');
      event.preventDefault();
    });

    // toggle top nav items
    $("a[data-toggle=\"tab\"]").click(function(e) {
      e.preventDefault();
      $(this).tab("show");
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
      $('.navbar-toggle:visible').click();
    });

    // Highlight the top nav as scrolling occurs
    // $('body').scrollspy({
      // target: '.navbar-fixed-top'
    // })

    // cbpScroll code
    // --------------

    var docElem = document.documentElement,
  		header = document.querySelector( '.navbar-fixed-top' ),
  		didScroll = false,
      showLogoOn = 450;

    // function scrollPage() {
    //   console.log(isMobile);
  	// 	var sy = scrollY();
    //   if ( sy >= showLogoOn ) {
  	// 		$(".navbar-brand").show();
    //     $(".navbar-nav li a").css('color', '#a49ea2');
  	// 	}
  	// 	else {
  	// 		// $(".navbar-brand").hide();
    //     $(".navbar-nav li a").css('color', '#0413a3')
  	// 	}
  	// 	didScroll = false;
  	// }
    //
  	// function scrollY() {
  	// 	return window.pageYOffset || docElem.scrollTop;
  	// }

    // var isMobile = false;
    // if ($("body").width() < 767) {
    //   isMobile = true;
    //   $(".navbar-brand").hide();
    // }

    // if (!isMobile) {
    //   window.addEventListener( 'scroll', function( event ) {
  	// 		if( !didScroll ) {
  	// 			didScroll = true;
  	// 			setTimeout( scrollPage, 450 );
  	// 		}
  	// 	}, false );
    // }

    // -- end

  });
};
