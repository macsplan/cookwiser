var mashapeKey = "Fsz4qtOaKNmshsm6NqrJIFaLjD6jp1lWBaMjsn7wQaIvTisGiS";
var ingredientsList = [];

$(document).ready(function(){

  $.ajaxSetup({
    headers: { "X-Mashape-Key": "Fsz4qtOaKNmshsm6NqrJIFaLjD6jp1lWBaMjsn7wQaIvTisGiS" }
  });

  $('#scotch-panel').scotchPanel({
    containerSelector: 'body',
    direction: 'right',
    duration: 300,
    transition: 'ease',
    clickSelector: '.toggle-panel',
    distanceX: '300px',
    enableEscapeKey: true
  });

  var clickHandler = function() {
    $(".grid-item a").on("click", function(e) {
      e.preventDefault();
      var id = $(this).data("id");
      console.log(id);

      $.ajax({
          url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/'+id+'/information',
          type: 'GET',
          data: {}, // Additional parameters here
          dataType: 'json',
          success: function(data) {
            console.log(data);
            $('.popup-modal').magnificPopup('open');
            $('.white-popup-block h1').text(data.title);
          },
          error: function(err) {
            alert(err);
          },
          beforeSend: function(xhr) {
            xhr.setRequestHeader("X-Mashape-Authorization", mashapeKey); // Enter here your Mashape key
          }
      });

    });
  };


	$('.popup-modal').magnificPopup({
		type: 'inline',
		preloader: false,
		modal: true
	});

	$(document).on('click', '.popup-modal-dismiss', function (e) {
		e.preventDefault();
		$.magnificPopup.close();
	});


  var renderResults = function(dishes) {

    var parent = $("#dishes");

    dishes.forEach(function(dish) {
      var child = $('<div/>')
        .addClass("grid-item");

      var linkname = (dish.title).replace(" ", "-");

      var link = $('<a/>')
        .attr("data-id", dish.id);
        //.attr("href", "https://webknox.com/recipe/"+linkname+"-"+dish.id)

      var title = $('<p/>')
        .addClass("text-overlay")
        .text(dish.title)
        .appendTo(link);

      var img = $('<img/>')
        .attr("src", "https://webknox.com/recipeImages/"+dish.image)
        .appendTo(link);

      link.appendTo(child);

      child.appendTo(parent);
    });

    clickHandler();

    var $grid = $('#dishes').masonry({
    });
    $grid.imagesLoaded().progress( function() {
      $grid.masonry('layout');
    });
  }

  $.ajax({
      url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?number=25',
      type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
      data: {}, // Additional parameters here
      dataType: 'json',
      success: function(data) {
        var dishes = {};
        console.log(data.results);
        dishes = data.results;
        renderResults(dishes);
      },
      error: function(err) {
        alert(err);
      },
      beforeSend: function(xhr) {
        xhr.setRequestHeader("X-Mashape-Authorization", mashapeKey); // Enter here your Mashape key
      }
  });

//   var states = [
//     'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
//     'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
//     'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
//     'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
//     'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
//     'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
//     'New Jersey', 'New Mexico', 'New York', 'North Carolina',
//     'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
//     'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee',
//     'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
//     'West Virginia', 'Wisconsin', 'Wyoming'
//   ];
//
//   $("#ingredients").autocomplete({
//   source:[states]
// });

  $('#ingredients').autocomplete({
    valueKey:'name',
    source: [{
      url:"https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/ingredients/autocomplete?metaInformation=false&number=10&query=%QUERY%",
      type:'remote'
    }],
    getTitle:function(item){
      return item['name']
    },
    getValue:function(item){
      return item['name']
    }
  });

  // $('button#open').click(function(){
  //   $('#remote_input').trigger('open');
  //   $('#remote_input').focus();
  // });

  // var addIngredients = function() {
  //   var item = $("#ingredients").val();
  //   if (!ingredientsList.includes(item)) {
  //     ingredientsList.push(item);
  //   }
  //   console.log(ingredientsList);
  // };

  // var easyAutocompleteOptions = {
  // 	url: function(phrase) {
  // 		return "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/ingredients/autocomplete?metaInformation=false&number=10&query=" + phrase;
  //   },
  //   getValue: "name",
  //   theme: "dark",
  //   list: {
  //     match: {
  //        enabled: false
  //     },
  //     onClickEvent: function() {
  //       var item = $("#ingredients").val();
  //       if (!ingredientsList.includes(item)) {
  //         ingredientsList.push(item);
  //       }
  //       console.log(ingredientsList);
  // 		},
  // 		onSelectItemEvent: function() {
  //       var item = $("#ingredients").val();
  //       if (!ingredientsList.includes(item)) {
  //         ingredientsList.push(item);
  //       }
  //       console.log(ingredientsList);
  // 		},
  // 	}
  // };
  //
  // $("#ingredients").easyAutocomplete(easyAutocompleteOptions);

});
