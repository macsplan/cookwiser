var mashapeKey = "Fsz4qtOaKNmshsm6NqrJIFaLjD6jp1lWBaMjsn7wQaIvTisGiS";

$(document).ready(function(){

  var renderResults = function(dishes) {

    var parent = $("#dishes");

    dishes.forEach(function(dish) {
      var child = $('<div/>')
        .addClass("grid-item")
        .attr("data-id", dish.id);

      var linkname = (dish.title).replace(" ", "-");

      var link = $('<a/>')
        .attr("href", "https://webknox.com/recipe/"+linkname+"-"+dish.id)

      var title = $('<p/>')
        .text(dish.title)
        .appendTo(link);

      var img = $('<img/>')
        .attr("src", "https://webknox.com/recipeImages/"+dish.image)
        .appendTo(link);

      link.appendTo(child);

      child.appendTo(parent);
    });

    var $grid = $('#dishes').masonry({
    });
    $grid.imagesLoaded().progress( function() {
      $grid.masonry('layout');
    });

  }
  //
  // $('.grid-item').on('click', funtion() {
  //
  // });

// load original dishes

  $.ajax({
      url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?number=25', // The URL to the API. You can get this in the API page of the API you intend to consume
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


  $.ajax({
      url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?number=25', // The URL to the API. You can get this in the API page of the API you intend to consume
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



// load recipe info



  // These code snippets use an open-source library. http://unirest.io/nodejs
  // "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=apples%2Cflour%2Csugar&limitLicense=false&number=5&ranking=1")

  // // These code snippets use an open-source library. http://unirest.io/nodejs
  // unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?diet=vegetarian&excludeIngredients=coconut&intolerances=egg%2C+gluten&limitLicense=false&number=10&offset=0&query=burger&type=main+course")
  // .header("X-Mashape-Key", "Fsz4qtOaKNmshsm6NqrJIFaLjD6jp1lWBaMjsn7wQaIvTisGiS")
  // .end(function (result) {
  //   console.log(result.status, result.headers, result.body);
  // });

});
