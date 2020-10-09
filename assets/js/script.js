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
          carddiv.addClass("card-div"); //add class
          carddiv.addClass("col-3") //add class
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

    var ingredientArr = [];
    var measureArr = [];
    for(i=1; i<20;i++){
      var ingredientStr = String('strIngredient'+i)
      var measureStr = String('strMeasure'+i)
      var newIngredient = response.meals[0]
      JSON.stringify(newIngredient,function(key,value){
        if (key == ingredientStr){
          ingredientArr.push(value)
        }else if(key == measureStr){
          measureArr.push(value)
        }
      })
      
      var ingredient = newIngredient[ingredientStr]
      ingredientArr.push(ingredient)
      var measurement = newIngredient[measureStr]
      measureArr.push(measurement)
      
    }
    console.log("newIngredient" + JSON.stringify(newIngredient))
    console.log("ingredients array: " + ingredientArr)
    console.log("mesaurement arry: " + measureArr )
    let myObj = {};
    for (let i=0; i<ingredientArr.length;i++){
      let key = ingredientArr[i];
      let value = measureArr[i];
      myObj[key] = value
    }
    var objstring = JSON.stringify(myObj).replace(/"/g,'').replace(/,/g,"\n")
    var ingredient_lst = "ingredeints: \n " + objstring
    console.log(ingredient_lst)


    

    $(".ingredients").text( ingredient_lst ) //ingredients
    
    $(".recipe").text(response.meals[0].strInstructions)//recipe
    $(".add-to-book").attr("data-name", recipeValue)
    $(".recipe-image").attr("src", response.meals[0].strMealThumb)

    $(".exitBtn").on("click", function(e){
      e.preventDefault()
      $(".cards").css("display", "block") //all of the cards are hidden 
      $(".hidden").css("display","none") //.hidden div will be displayed
    })
  })
}


//event listeners 

//user input submit
$("#submit").on("click", function(e){
  e.preventDefault();
  var ingredientSearch = $("#search").val() //will pick up what you type into the search bar
  searchResults(ingredientSearch)
  
})

//Also allows the user to hit enter
$('.search').keypress(function(e){
  if(e.which == 13){
      $('.submit').click();
      }
  })

$(".add-to-book").on("click", function(){
  var recipeTitle = $("#recipe-title").text()
  var recipeValue = $(this).attr("data-name")
  addRecipe(recipeTitle, recipeValue)
})

createRecipeBook()