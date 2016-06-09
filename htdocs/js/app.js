var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    disableDefaultUI: true,
    scrollwheel: false,
    draggable: false,
    center: new google.maps.LatLng(43.6426, -79.3871),
    zoom: 13,
    styles:
    [
      {
          "featureType": "all",
          "elementType": "labels.text.fill",
          "stylers": [
              {
                  "color": "#ffffff"
              }
          ]
      },
      {
          "featureType": "all",
          "elementType": "labels.text.stroke",
          "stylers": [
              {
                  "color": "#000000"
              },
              {
                  "lightness": 13
              }
          ]
      },
      {
          "featureType": "administrative",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "color": "#000000"
              }
          ]
      },
      {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
              {
                  "color": "#144b53"
              },
              {
                  "lightness": 14
              },
              {
                  "weight": 1.4
              }
          ]
      },
      {
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [
              {
                  "color": "#08304b"
              }
          ]
      },
      {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#0c4152"
              },
              {
                  "lightness": 5
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "color": "#000000"
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
              {
                  "color": "#0b434f"
              },
              {
                  "lightness": 25
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "color": "#000000"
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "geometry.stroke",
          "stylers": [
              {
                  "color": "#0b3d51"
              },
              {
                  "lightness": 16
              }
          ]
      },
      {
          "featureType": "road.local",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#000000"
              }
          ]
      },
      {
          "featureType": "transit",
          "elementType": "all",
          "stylers": [
              {
                  "color": "#146474"
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "all",
          "stylers": [
              {
                  "color": "#1E1E1E"
              }
          ]
      }
    ]
  });
}

jQuery(document).ready(function(){

  jQuery("#header-wrapper").sticky({topSpacing:0});

  jQuery("#video-banner").vide({
    'mp4': 'https://s3-us-west-2.amazonaws.com/uxgent/videos/launch.mp4',
    'webm': 'https://s3-us-west-2.amazonaws.com/uxgent/videos/launch.webm',
    'ogv': 'https://s3-us-west-2.amazonaws.com/uxgent/videos/launch.ogv',
    'poster': 'https://s3-us-west-2.amazonaws.com/uxgent/videos/launch.jpg'
  },
  {
    'muted': 'true',
    'loop': 'true',
    'autoplay': 'true',
    'posterType': 'jpg',
    'position': '50% 50%',
    'resizing': 'true'
  });

  jQuery('.jump-to').on('click', function(e) {
    e.preventDefault();
    var loc = jQuery(this).data("id");
    if (loc.length > 0) {
      jQuery(window).scrollTo($(loc), 800, {offset: -48});
    }
  });

}) 
