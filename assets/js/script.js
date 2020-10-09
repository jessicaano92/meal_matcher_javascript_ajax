//Declare Global Variables
var recipeBookArr = [];
var recipeBookArrStorage = localStorage.getItem("recipeBookArrStorage")
if (recipeBookArrStorage !== null){
  recipeBookArr = JSON.parse(recipeBookArrStorage)
}

//Function for Searching
function searchResults(ingredientSearch){ //creates cards dynamically references the API for image and title------

  var queryURL = "https://www.themealdb.com/api/json/v1/1/filter.php?i=" + ingredientSearch;
  $.ajax({
      url: queryURL,
      method: "GET"
  }).then(function(response){
      console.log(JSON.stringify(response));
      $(".top3").empty();
      $(".bottom3").empty();
      for(var i=0; i < 6; i++){

    
          var carddiv= $("<div>"); //creating new div
          carddiv.addClass("card-div "); //add class
          carddiv.addClass("col-sm-12 col-md-12 col-lg-3") //add class
          carddiv.css("width", "18rem") //styling 
          if (i < 3){
          $(".top3").append(carddiv); //putting into HTML
          } else {
            $(".bottom3").append(carddiv);
          }
          var choiceImg = response.meals[i].strMealThumb; //web image 
          console.log(choiceImg); 
          var cardImg = $("<img>")
          cardImg.attr("src", choiceImg)
          cardImg.addClass("card-img-top")
          carddiv.append(cardImg);     

          var mainchoice = response.meals[i].strMeal; //name of the meals 
          console.log(mainchoice);
          var cardheader = $("<h1>") //create H1 tag
          cardheader.addClass("recipe-title")
          cardheader.text(mainchoice) //put the text of mainchoice into the h1 that we created
          carddiv.append(cardheader);

          var recipeValue = response.meals[i].idMeal ; //data-name
          console.log(recipeValue);
          carddiv.attr("data-name", recipeValue)

      }
      //click for cards 
      $(".cards").on("click", ".card-div", function(){
        
        $(".cards").css("display", "none") //all of the cards are hidden 
        $(".hidden").css("display","block") //.hidden div will be displayed
        var thisRecipeValue = $(this).attr("data-name") //always be equal to what was clicked
        recipePage(thisRecipeValue)
        
        
      })
  });
}

//Function for Adding a recipe to the Recipe Book
function addRecipe(recipeName, recipeValue){
  var recipeAddToArray = {recipeName, recipeValue}
  var okToAdd = true;
  for (var i=0; i <recipeBookArr.length; i++){
    var currentObj = recipeBookArr[i]
    if (currentObj.recipeName === recipeName){
      okToAdd = false;
    }
  }
  if (okToAdd){
  recipeBookArr.push(recipeAddToArray);
  console.log(recipeBookArr)
  localStorage.setItem("recipeBookArrStorage", JSON.stringify(recipeBookArr))
  $(".recipe-book").empty();
  createRecipeBook()
  }
}

//Function for creating the Recipe book
function createRecipeBook(){
  if (recipeBookArr){
    for (var i=0; i<recipeBookArr.length; i++){
      var newRecipeButton = $("<button>");
      newRecipeButton.text(recipeBookArr[i].recipeName)
      newRecipeButton.addClass("recipeHistoryBtn")
      newRecipeButton.attr("data-name", recipeBookArr[i].recipeValue)
      $(".recipe-book").append(newRecipeButton)
    }
  }
}

//Function for creating the recipe page
function recipePage(recipeValue) {
  //populate new previously hidden div with info from this AJAX 
  var recipeQueryURL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + recipeValue

  console.log(recipeValue)

  $.ajax({
    url: recipeQueryURL,
    method: "GET"
  }).then(function(response){
    console.log(response)
    
    var recipeTitle = response.meals[0].strMeal
    $("#recipe-title").text(recipeTitle)//recipe title
    $(".recipe").text(response.meals[0].strInstructions)//recipe
    $(".add-to-book").attr("data-name", recipeValue)
    $(".recipe-image").attr("src", response.meals[0].strMealThumb)

    //Creating the ingredients array, Gary helped with this:
      var newMealObj = {}
      var newMealsArr = []
      newMealObj.ingredients = []
      console.log(newMealObj)
      var recipeObj
      // Loop from 1 to 20 (for how many possible ingredients there are)
      for(var i=1; i<=20; i++){
        // There are two types of data: ingredients and measure
        var props = ["Ingredient", "Measure"]
        // Create a new object each time through to hold the recipe data
        recipeObj = {}
        // Loop through the two differet data types (Ingredients and Measures)
        props.forEach( function(prop) {
          var propName = "str" + prop + i
          // If we have a value in the original object, we can add that info to our new recipe object
          if( response.meals[0][propName] !== undefined && response.meals[0][propName].length > 0){
            recipeObj[prop.toLowerCase()] = response.meals[0][propName]
          }
        })
        // If the new recipe object has data, we can add it to our ingredients array
        if( recipeObj.ingredient !== undefined ){
          newMealObj.ingredients.push(recipeObj)
        }
      }
      // We've now built the mealObj and can add it to the meals array
      newMealsArr.push(newMealObj)

      //This is actually creating the ingredients on the web page
      $(".ingredients").empty();
      var ingredientHeader = $("<h2>").text("Ingredients")
      $(".ingredients").append(ingredientHeader)
      for (var i=0; i <newMealsArr[0].ingredients.length; i++){
      var listIngredient = $("<li>").text(newMealsArr[0].ingredients[i].ingredient + ", " + newMealsArr[0].ingredients[i].measure)
      $(".ingredients").append(listIngredient)
      }
    })

    //Event Listener for closing the window
    $(".exitBtn").on("click", function(e){
      e.preventDefault()
      $(".cards").css("display", "block") //all of the cards are hidden 
      $(".hidden").css("display","none") //.hidden div will be displayed
  })
}


//Event Listener for user searching and hitting "Submit"

$("#submit").on("click", function(e){
  e.preventDefault();
  var ingredientSearch = $("#search").val() //will pick up what you type into the search bar
  searchResults(ingredientSearch)
  $(".cards").css("display", "block")        //will show all of the cards
  $(".hidden").css("display","none")       //will hide the recipe page
})

//Also allows the user to hit enter
$('.search').keypress(function(e){
  if(e.which == 13){
      $('.submit').click();
      }
  })

//Event Listener for clicking on "Add to Recipe Book"
$(".add-to-book").on("click", function(){
  var recipeTitle = $("#recipe-title").text()
  var recipeValue = $(this).attr("data-name")
  addRecipe(recipeTitle, recipeValue)
})

//Event Listener for clicking on "X"
$(".clear").on("click", function(){
  localStorage.clear();
  recipeBookArr = [];
 // remove buttons on click
 $(".recipeHistoryBtn").removeAttr("style").hide();
})

//Event Listener for clicking on "Random Recipe"
$(".randomRecipe").on("click", function(e){

  var recipeQueryURL = "https://www.themealdb.com/api/json/v1/1/random.php"
  $(".cards").css("display", "none")
  $.ajax({
    url: recipeQueryURL,
    method: "GET"
  }).then(function(response){
    console.log(response)

 

    var recipeValue = response.meals[0].idMeal
    $(".cards").css("display", "none")        //will hide all of the cards
    $(".hidden").css("display","block")       //will show the recipe page
    recipePage(recipeValue)
  })
})

//Event Listener for clicking on a recipe in the Recipe Book

$(".recipe-book").on("click", ".recipeHistoryBtn" , function () {
  var recipeValue = $(this).attr("data-name");
  $(".cards").css("display", "none")        //will hide all of the cards
  $(".hidden").css("display","block")       //will show the recipe page
  recipePage(recipeValue);
})



//Loads all recipe book items on page load
createRecipeBook()

