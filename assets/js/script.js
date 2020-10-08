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

function addRecipe(recipeName, recipeValue){
  var recipeAddToArray = {recipeName, recipeValue}
  recipeBookArr.push(recipeAddToArray);
  console.log(recipeBookArr)
  localStorage.setItem("recipeBookArrStorage", JSON.stringify(recipeBookArr))
  $(".recipe-book").empty();
  createRecipeBook()
}

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
    

    $(".ingredients").text("Ingredients: " + response.meals[0].strIngredient1 + ", " + response.meals[0].strIngredient2 + ", " + response.meals[0].strIngredient3 + ", " + response.meals[0].strIngredient4 + ", " + response.meals[0].strIngredient5 + ", " + response.meals[0].strIngredient6 + ", " + response.meals[0].strIngredient7 + ", " + response.meals[0].strIngredient8 + ", " + response.meals[0].strIngredient9 + ", " + response.meals[0].strIngredient10 ) //ingredients
    
    $(".recipe").text(response.meals[0].strInstructions)//recipe

    $(".recipe-image").attr("src", response.meals[0].strMealThumb)

  

    $(".add-to-book").on("click", function(){
      console.log(recipeTitle)
      console.log(recipeValue)
      addRecipe(recipeTitle, recipeValue)
    })
     //find bootstrap classes for button


     $(".exitBtn").on("click", function(e){
      e.preventDefault()
      $(".cards").css("display", "block") //all of the cards are hidden 
      $(".hidden").css("display","none") //.hidden div will be displayed
    
    })

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



createRecipeBook()



// $(".cards").on("click", ".card-div", function(){
//   console.log("click");
 
// }) 
// $('.search').keypress(function(e){
//   if(e.which == 13){
//       $('.submit').click();
//       }
//   })



