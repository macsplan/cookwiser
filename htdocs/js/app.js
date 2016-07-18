var mashapeKey = "Fsz4qtOaKNmshsm6NqrJIFaLjD6jp1lWBaMjsn7wQaIvTisGiS";
var ingredientsList = [];
var currentItem;

$(document).ready(function(){

  var openDialog = function(id, data) {

    $('.popup-modal').magnificPopup('open');

    // get recipe information
    $.ajax({
        url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/'+id+'/information',
        type: 'GET',
        data: {}, // Additional parameters here
        dataType: 'json',
        success: function(data) {
          $('.white-popup-block h1').text(data.title);
          $('.white-popup-block img').attr('src', data.image);
          $('.white-popup-block .ingredients').empty();
          var ingredients = data.extendedIngredients;
          ingredients.forEach(function(ingredient) {
            var line = $("<p/>")
              .text(ingredient.name)
              .appendTo($('.white-popup-block .ingredients'));
            var instruction = $("<span/>")
              .text(ingredient.originalString)
              .appendTo(line);
            var img = $("<img/>")
              .attr("src", ingredient.image)
              .appendTo(line);
          });
        },
        error: function(err) {
          alert(err);
        }
    });

    // get recipe instructions
    $.ajax({
        url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/'+id+'/analyzedInstructions?stepBreakdown=true',
        type: 'GET',
        data: {}, // Additional parameters here
        dataType: 'json',
        success: function(data) {
          var steps = data[0].steps;
          $('.white-popup-block .method').empty();

          var ol = $("<ol/>");

          steps.forEach(function(step) {
            var line = $("<li/>")
              .text(step.step)
              .appendTo(ol);
          });

          ol.appendTo($('.white-popup-block .method'));
        },
        error: function(err) {
          alert(err);
        }
    });
  }

  var appendDishesTo = function(items, element) {
    var dishes = $('<div/>')
      .attr("id", "dishes")
      .addClass("grid");

    var gridSizer = $('<div/>')
      .addClass("grid-sizer")
      .appendTo(dishes);

    items.forEach(function(item) {
      var child = $('<div/>')
        .addClass("grid-item");

      var linkname = (item.title).replace(" ", "-");

      var link = $('<a/>')
        .attr("data-id", item.id)
        .on("click", function(e) {
          e.preventDefault();
          openDialog($(this).data("id"), this);
        });

      var title = $('<p/>')
        .addClass("text-overlay")
        .text(item.title)
        .appendTo(link);

      var imgPath = "";
      if (item.image.indexOf("https") > -1) {
        imgPath = item.image;
      } else {
        imgPath = "https://webknox.com/recipeImages/" + item.image;
      }

      var img = $('<img/>')
        .attr("src", imgPath)
        .appendTo(link);

      link.appendTo(child);
      child.appendTo(dishes);
    });

    dishes.appendTo(element);
  }


  // render results
  var renderResults = function(items) {
    var results = $("#results");
    results.empty();

    appendDishesTo(items, results)

    var $grid = $('#dishes').masonry();

    $grid.imagesLoaded().progress( function() {
      $grid.masonry('layout');
    });
  }

  // style ingredients in filter
  var styleMyIngredients = function() {
    $(".myIngredients li").removeClass("last");

    var remainder = $(".myIngredients li").length % 2;

    if (remainder > 0) {
      $(".myIngredients li:last-child").addClass("last");
    }
  }

  // search by ingredients
  var searchByIngredients = function() {
    var ingredientsStr = ingredientsList.join(',');
    var parseStr = escape(ingredientsStr);
    $.ajax({
        url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients='+parseStr+'&limitLicense=false&number=25&ranking=1',
        type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
        data: {}, // Additional parameters here
        dataType: 'json',
        success: function(data) {
          var dishes = {};
          dishes = data;
          renderResults(dishes);
        },
        error: function(err) {
          alert(err);
        }
    });
  }

  // add ingredient to filter
  var addIngredientToFilter = function() {
    var parent = $(".myIngredients");

    var listItem = $('<li/>')
      .text(currentItem)

    var remove = $('<a/>')
      .addClass('remove')
      .appendTo(listItem);

    remove.bind("click", function(e) {
      var itemtoRemove = $(this).parent().text();
      var index = ingredientsList.indexOf(itemtoRemove);
      if (index > -1) {
        ingredientsList.splice(index, 1);
      }
      $(this).unbind("click");
      $(this).parent().remove();
      styleMyIngredients();
      searchByIngredients();
    });

    listItem.appendTo(parent)

    styleMyIngredients();
    searchByIngredients();
  }


  // init
  var init = function() {
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

    $('.popup-modal').magnificPopup({
  		type: 'inline',
  		preloader: false,
  		modal: true
  	});

  	$(document).on('click', '.popup-modal-dismiss', function (e) {
  		e.preventDefault();
  		$.magnificPopup.close();
  	});

    $.ajax({
      url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?number=25',
      type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
      data: {}, // Additional parameters here
      dataType: 'json',
      success: function(data) {
        var dishes = {};
        dishes = data.results;
        renderResults(dishes);
      },
      error: function(err) {
        alert(err);
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
        $('#mainIngredients h3').hide()
        $('#mainIngredients label').text("Add ingredient");
        addIngredientToFilter()
      }
    });
  }

  init();

});
