const key = "1";

function searchResults(ingredientSearch){
  var queryURL = "https://www.themealdb.com/api/json/v1/1/filter.php?i=" + ingredientSearch;
  $.ajax({
      url: queryURL,
      method: "GET"
  }).then(function(response){
      console.log(JSON.stringify(response));
      for(var i=0; i < 6; i++){
          var mainchoice = response.meals[i].strMeal;
          console.log(mainchoice);
          var recipe = response.meals[i].strMealThumb ;
          console.log(recipe);
          var choiceimg = response.meals[i].idMeal;
          console.log(choiceimg);      
      }
  });
}

var recipeBookArr = [];
var recipeBookArrStorage = localStorage.getItem("recipeBookArrStorage")
if (recipeBookArrStorage !== null){
  recipeBookArr = JSON.parse(recipeBookArrStorage)
}

function addRecipe(){
  var recipeName = ($this).val()
  recipeBookArr.push(recipeName);
  localStorage.setItem("recipeBookArrStorage", JSON.stringify(recipeBookArr))
  $(".recipe-book").empty();
  createRecipeBook()
}

function createRecipeBook(){
  if (recipeBookArr){
    for (var i=0; i<recipeBookArr.length; i++){
      var newRecipeButton = $("<button>");
      newRecipeButton.text(recipeBookArr[i])
      $(".recipe-book").append(newRecipeButton)
    }
  }
}

function recipePage(recipeValue) {
  //on click of card expand page wait til card is made for this 
  var recipeQueryURL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + recipeValue

  $.ajax({
    url: recipeQueryURL,
    method: "GET"
  }).then(function(response){
    console.log(response)

    $("#recipe-title").text()//whatever recipe title is
    $(".ingredients").text()//whatever ingredient is in object
    $(".recipe").text()//whatever recipe is

    var addButton = ("<button>")
    addButton.text("Add to Recipe Book").addClass("recipeBtn") //find bootstrap classes for button

    var exitButton = ("<button>")
    exitButton.text("X").addClass("exitBtn") //find bootstrap classes for button 

    //append to class 


  })
}

$("#submit").on("click", function(e){
  e.preventDefault();
  var ingredientSearch = $("#search").val()
  searchResults(ingredientSearch)
})