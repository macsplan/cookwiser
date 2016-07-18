var mashapeKey = "Fsz4qtOaKNmshsm6NqrJIFaLjD6jp1lWBaMjsn7wQaIvTisGiS";
var ingredientsList = [];
var currentItem;

$(document).ready(function(){

  var renderResults = function(dishes) {
    var parent = $("#dishes");

    parent.empty();

    dishes.forEach(function(dish) {
      var child = $('<div/>')
        .addClass("grid-item");

      var linkname = (dish.title).replace(" ", "-");

      var link = $('<a/>')
        .attr("data-id", dish.id)
        .on("click", function(e) {
          e.preventDefault();
          var id = $(this).data("id");
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

      var title = $('<p/>')
        .addClass("text-overlay")
        .text(dish.title)
        .appendTo(link);

      var imgPath = "";
      if (dish.image.indexOf("https") > -1) {
        imgPath = dish.image;
      } else {
        imgPath = "https://webknox.com/recipeImages/" + dish.image;
      }

      var img = $('<img/>')
        .attr("src", imgPath)
        .appendTo(link);

      link.appendTo(child);

      child.appendTo(parent);
    });

    var gridSizer = $('<div/>')
      .addClass("grid-sizer");

    dishes.appendTo(gridSizer);

    clickHandler();

    var $grid = $('#dishes').masonry({
    });
    $grid.imagesLoaded().progress( function() {
      $grid.masonry('layout');
    });
  }

  var styleMyIngredients = function() {
    $(".myIngredients li").removeClass("last");

    var remainder = $(".myIngredients li").length % 2;

    if (remainder > 0) {
      $(".myIngredients li:last-child").addClass("last");
    }
  }

  var convertToStr = function() {
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
        },
        beforeSend: function(xhr) {
          xhr.setRequestHeader("X-Mashape-Authorization", mashapeKey); // Enter here your Mashape key
        }
    });
  }

  var appendItem = function() {
    var parent = $(".myIngredients");

    var listItem = $('<li/>')
      .text(currentItem)

    var remove = $('<a/>')
      .addClass('remove')
      .appendTo(listItem);

    remove.bind("click", function(e) {
      var itemtoRemove = $(this).parent().text();
      console.log(itemtoRemove);
      var index = ingredientsList.indexOf(itemtoRemove);
      if (index > -1) {
        ingredientsList.splice(index, 1);
      }
      $(this).unbind("click");
      $(this).parent().remove();
      styleMyIngredients();
    });

    listItem.appendTo(parent)

    styleMyIngredients();
    convertToStr();
  }


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
        $('#mainIngredients h3').hide()
        $('#mainIngredients label').text("Add ingredient");
        appendItem()
      }
    });
  }

  init();
});
