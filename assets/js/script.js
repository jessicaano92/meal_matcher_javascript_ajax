

let ingredientSearch = "chicken"

const key = "1";

var queryURL = "https://www.themealdb.com/api/json/v1/1/filter.php?i=" + ingredientSearch;

console.log(queryURL)
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




