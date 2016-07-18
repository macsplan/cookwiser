var mashapeKey = "Fsz4qtOaKNmshsm6NqrJIFaLjD6jp1lWBaMjsn7wQaIvTisGiS";
var ingredientsList = [];
var currentItem;

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

  var appendItem = function() {
    var ingredientsStr = ingredientsList.join(',');
    console.log(ingredientsStr);
    var parent = $(".myIngredients");

    var listItem = $('<li/>')
      .text(currentItem)
      .appendTo(parent);

    $(".myIngredients li").removeClass("last");

    var remainder = $(".myIngredients li").length % 2;

    if (remainder > 0) {
      $(".myIngredients li:last-child").addClass("last");
    }
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

  $('#ingredients').autocomplete({
    valueKey:'name',
    limit: 12,
    visibleLimit: 6,
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
  }).on('selected.xdsoft',function(e,datum){
    currentItem = $("#ingredients").val();
    if (!ingredientsList.includes(currentItem )) {
      ingredientsList.push(currentItem );
      $('#mainIngredients h3').hide();
      appendItem()
    }
  });


});
