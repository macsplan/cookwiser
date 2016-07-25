// global variables
var mashapeKey = "Fsz4qtOaKNmshsm6NqrJIFaLjD6jp1lWBaMjsn7wQaIvTisGiS";
var ingredientsList = [];
var currentItem;
var offsetAmount;
var convertIngtoStr = "";
var cuisineType = "";
var mealTime = "";
var foodIntolerance = "";
var $selectPopup = $('.white-popup-block');

// create pdf from html
var createPDF = function() {
  var pdf = new jsPDF('p', 'pt', 'letter');
    var options = {
    background: '#fff' //background is transparent if you don't set it, which turns it black for some reason.
    };
    pdf.addHTML($('#print').get(0), function () {
    pdf.save('Recipe Card.pdf');
    });
};

var writeRecipe = function(data) {
  var $selectPopup = $('.white-popup-block');
  var $selectPopupServe = $selectPopup.find('.serving span em');
  var $selectPopupReady = $selectPopup.find('.ready_in span em');
  var $selectIngredList = $selectPopup.find('.ingredients .list');
  $selectPopup.find('h1').text(data.title);
  $selectPopup.find('.imageRow img').attr('src', data.image);
  $selectPopupServe.empty();
  $selectPopupServe.text(data.servings);
  $selectPopupReady.empty();
  $selectPopupReady.text(data.readyInMinutes+ " minutes");
  $selectPopup.find('.cardIntro em').text( data.title);

  $selectIngredList.empty();
  var ingredients = data.extendedIngredients;
  ingredients.forEach(function(ingredient) {
    var line = $("<p/>")
      .appendTo($selectIngredList);
    var img = $("<img/>")
      .attr("src", ingredient.image)
      .appendTo(line);
    var instruction = $("<span/>")
      .text(ingredient.originalString)
      .appendTo(line);
  });
}

var writeMethodSteps = function(data) {
  if (data.length > 0) {
    var steps = data[0].steps;
    console.log($selectPopup);
    $('.white-popup-block .method').empty();

    var ol = $("<ol/>");

    steps.forEach(function(step) {
      var line = $("<li/>")
        .text(step.step)
        .appendTo(ol);
    });
  } else {
    var ol = $("<ol/>");
      linkname = linkname.toLowerCase();

      var link = $("<a/>")
      .attr("href", "https://spoonacular.com/recipes/"+linkname+"-"+id)
      .text("Read the detailed instructions here");

      link.appendTo(ol);
  }

  ol.appendTo($('.white-popup-block .method'));
};

// main code
$(document).ready(function(){
  // recipe popup modal
  var openDialog = function(id, linkname, data) {

    $('.popup-modal').magnificPopup('open');

    // get recipe information
    $.ajax({
        url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/'+id+'/information',
        type: 'GET',
        data: {}, // Additional parameters here
        dataType: 'json',
        success: function(data) {
          writeRecipe(data);
        },
        error: function(err) {
          alert(err);
        }
    });

    // get recipe summary

    $.ajax({
        url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/'+id+'/summary',
        type: 'GET',
        data: {}, // Additional parameters here
        dataType: 'json',
        success: function(data) {
          console.log(data);
          $('.white-popup-block .summary').html(data.summary);
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
          console.log(data);
          writeMethodSteps(data);
        },
        error: function(err) {
          alert(err);
        }
    });

    $.ajax({
        url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/'+id+'/similar',
        type: 'GET',
        data: {}, // Additional parameters here
        dataType: 'json',
        success: function(data) {
          console.log(data);
          var el = $('#similar-recipies');

          appendDishesTo(data, el);

        },
        error: function(err) {
          alert(err);
        }
    });
  };

  // utility function to generate random number between two points
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // NOTE: for the initial page load and if you have no filters selected at all,
  // this will randomly generate a number between 0 and 800 as the starting
  // point, and then 100 dishes are returned from the ajax called.
  // this it to prevent having the same dishes shown every time.
  offsetAmount = getRandomInt(0, 800);

  // filters results by mealTime / cuisineType / ingredientsStr / foodIntolerance
  var filterDishes = function() {
    var url = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/searchComplex?limitLicense=false&number=100&offset=0&query=recipe&ranking=1";

    if (!mealTime == "") {
      url = url + "&type="+mealTime;
    }

    if (!cuisineType == "") {
      url = url + "&cuisine="+encodeURI(cuisineType);
    }

    if (!convertIngtoStr == "") {
      url = url + "&includeIngredients="+convertIngtoStr;
    }

    if (!foodIntolerance == "") {
      url = url + "&intolerances="+foodIntolerance;
    }

    $.ajax({
        url: url,
        type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
        data: {}, // Additional parameters here
        dataType: 'json',
        success: function(data) {
          var dishes = {};
          dishes = data.results;
          renderResults(dishes);

          if (data.results.length === 0) {
            $('#mainIngredients label').text("Main Ingredient");
            offsetAmount = getRandomInt(0, 800);
            loadDishes();
          }
        },
        error: function(err) {
          alert(err);
        }
    });
  };

  // get dishes via ajax
  var loadDishes = function() {
    $.ajax({
      url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?number=100&offset='+offsetAmount,
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
  };

  // append dishes to element, creating html elements on the fly
  var appendDishesTo = function(items, element) {
    element.empty();

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
          console.log(item)
          openDialog($(this).data("id"), linkname, this);
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

    // dishes.masonry({
    //   itemSelector: '.grid-item'
    // });

    dishes.masonry();

    dishes.imagesLoaded().progress( function() {
     dishes.masonry('layout');
    });

  };


  // render results (called by loadDishes)
  var renderResults = function(items) {
    var results = $("#results");
    results.empty();

    appendDishesTo(items, results)

    // var $grid = $('#dishes').masonry();
    //
    // $grid.imagesLoaded().progress( function() {
    //   $grid.masonry('layout');
    // });
  };

  // style ingredients in filter
  var styleMyIngredients = function() {
    $(".myIngredients li").removeClass("last");

    var remainder = $(".myIngredients li").length % 2;

    if (remainder > 0) {
      $(".myIngredients li:last-child").addClass("last");
    }
  };

  // search by ingredients
  var searchByIngredients = function() {
    var ingredientsStr = ingredientsList.join(',');
    convertIngtoStr = escape(ingredientsStr);
    filterDishes();
  };

  // setup onchange handlers for dropdown filters
  var searchFilter = function() {
    $( "select[name=cuisine]" ).change(function() {
      var cuisineChoosen = $("select[name=cuisine] option:selected").val();
      cuisineType = cuisineChoosen;
      filterDishes();
    });
    $( "select[name=mealTime]" ).change(function() {
      var timeOfMeal = $("select[name=mealTime] option:selected").val();
      mealTime = timeOfMeal;
      filterDishes();
    });
    $( "select[name=foodIntolerance]" ).change(function() {
      var foodInt = $("select[name=foodIntolerance] option:selected").val();
      foodIntolerance = foodInt;
      filterDishes();
    });
  };

  // adds ingredients to filter sidebar
  var addIngredientToFilter = function() {
    $('.hidefilter').show();
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
  };


  // initializer
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
      distanceX: '320px',
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

    loadDishes();

    // setup autocomplete
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

    searchFilter();

    $('#create_pdf').on('click',function(){
     createPDF();
    });
  };

  // manually fire initializer
  init();
});
