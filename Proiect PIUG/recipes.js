import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { clear_field, add_item_to_html_list, clear_HTML_list } from "./functions.js"

const appSettings = {
    databaseURL: "https://grocerylist-82ff0-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const recipesListInDB = ref(database, "recipe-list")

const ingredientInputEl = document.getElementById("ingredient-input")
const addIngredientButtonEl = document.getElementById("add-ingredient-button")
const ingredientListEl = document.getElementById("ingredient-list")
const saveRecipeButtonEl = document.getElementById("save-recipe-button")
const recipeListEl = document.getElementById("recipe-list")
const recipeNameEl = document.getElementById("recipe-name-input")
const goBackButtonEl = document.getElementById("go-back-button")

addIngredientButtonEl.addEventListener("click", function(){
    let newEl = document.createElement("li")

    newEl.textContent = ingredientInputEl.value
    newEl.addEventListener("click", function (){
        newEl.remove()
    })

    ingredientListEl.append(newEl)

    clear_field(ingredientInputEl)
})

saveRecipeButtonEl.addEventListener("click", function(){
    let ingredientsFromUl = document.querySelectorAll("#ingredient-list li")
    let newRecipe = { name: recipeNameEl.value }
    clear_field(recipeNameEl)

    ingredientsFromUl.forEach((item, index) => {
        newRecipe[index] = item.textContent
    })

    push(recipesListInDB, newRecipe)

    clear_HTML_list(ingredientListEl)
})

onValue(recipesListInDB, function(snapshot){
    let recipeList = Object.entries(snapshot.val())

    clear_HTML_list(recipeListEl)

    recipeList.forEach(function(entry){
        let[entryKey, entryValue] = entry
        let recipeName = entryValue.name
        let ingredientList = []
        
        Object.entries(entryValue).forEach(function([itemKey, itemValue]){
            if(itemKey != "name")
                ingredientList.push(itemValue)
        })

        createNewRecipe(ingredientList, recipeName)
    })
})

function createNewRecipe(ingredients, name){
    let newNameEl = document.createElement("label")
    let newButtonEl = document.createElement("button")
    let newRecipeEl = document.createElement("ul")
    newRecipeEl.id = name
    newNameEl.htmlFor = newRecipeEl.name
    newNameEl.textContent = name

    newButtonEl.id = `${name}-button`
    newButtonEl.type = "button"
    newButtonEl.textContent = "Add to Cart"
    newButtonEl.addEventListener("click", function(){
        let recipeId = name
        sessionStorage.setItem("recipeId", recipeId)
        window.location.href = "list.html"
    })
    

    ingredients.forEach(function(item){
        let newItem = document.createElement("li")
        newItem.textContent = item
        newRecipeEl.append(newItem)
    })

    recipeListEl.append(newNameEl)
    recipeListEl.append(newButtonEl)
    recipeListEl.append(newRecipeEl)
}

goBackButtonEl.addEventListener("click", function(){
    window.location.href = "list.html"
})