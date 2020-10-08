var key = "1";

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

          if (i < 3){
          var carddiv= $("<div>"); //creating new div
          carddiv.addClass("card-div"); //add class
          carddiv.addClass("col-3") //add class
          carddiv.css("width", "18rem") //styling 
          $(".top3").append(carddiv); //putting into HTML

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

          if (i > 2){
            var carddiv= $("<div>");
            carddiv.addClass("card-div");
            carddiv.addClass("col-3")
            carddiv.css("width", "18rem")
            $(".bottom3").append(carddiv);
  
            var choiceImg = response.meals[i].strMealThumb;
            console.log(choiceImg); 
            var cardImg = $("<img>")
            cardImg.attr("src", choiceImg)
            cardImg.addClass("card-img-top")
            carddiv.append(cardImg);     
  
            var mainchoice = response.meals[i].strMeal;
            console.log(mainchoice);
            var cardheader = $("<h1>")
            cardheader.addClass("recipe-title")
            cardheader.text(mainchoice)
            carddiv.append(cardheader);
  
            var recipeValue = response.meals[i].idMeal ;
            carddiv.attr("data-name", recipeValue)

            
          }

          
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
//------------------------------------------------


var recipeBookArr = [];
var recipeBookArrStorage = localStorage.getItem("recipeBookArrStorage")
if (recipeBookArrStorage !== null){
  recipeBookArr = JSON.parse(recipeBookArrStorage)
}

function addRecipe(){
  var recipeName = $(this).val()
  var recipeValue = $(this).val()
  var recipeAddToArray = (recipeName, recipeValue)
  recipeBookArr.push(recipeAddToArray);
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
  //populate new previously hidden div with info from this AJAX 
  var recipeQueryURL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + recipeValue

  console.log(recipeValue)

  $.ajax({
    url: recipeQueryURL,
    method: "GET"
  }).then(function(response){
    console.log(response)

    $("#recipe-title").text(response.meals[0].strMeal)//recipe title
    var ingredients = response.meals[0].strIngredient1
    $(".ingredients").text(ingredients)
    //whatever ingredient is in object
    // $(".recipe").text()//whatever recipe is

    // var addButton = ("<button>")
    // addButton.text("Add to Recipe Book").addClass("recipeBtn") //find bootstrap classes for button

    // var exitButton = ("<button>")
    // exitButton.text("X").addClass("exitBtn") //find bootstrap classes for button 

    //append to class 


  })
}


//event listeners 

//user input submit
$("#submit").on("click", function(e){
  e.preventDefault();
  var ingredientSearch = $("#search").val() //will pick up what you type into the search bar
  searchResults(ingredientSearch)
  
})



$(".cards").on("click", ".card-div", function(){
  console.log("click");
 
}) 
$('.search').keypress(function(e){
  if(e.which == 13){
      $('.submit').click();
      }
  })

