import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { clear_field, add_item_to_html_list, clear_HTML_list } from "./functions.js"

const appSettings = {
    databaseURL: "https://grocerylist-82ff0-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shopping-list")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const recipesPageButtonEl = document.getElementById("recipe-page-button")
const contactPageButtonEl = document.getElementById("contact-page-button")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    push(shoppingListInDB, inputValue)

    clear_field(inputFieldEl)
})

onValue(shoppingListInDB, function(snapshot) {
    clear_HTML_list(shoppingListEl)
    if(snapshot.exists()){
        let itemsArray = Object.entries(snapshot.val())

        for(let i = 0; i < itemsArray.length; i++){
            let currentItem = itemsArray[i]

            addItemToShoppingList(currentItem)
        }
    }
    else{
        add_item_to_html_list(shoppingListEl, "No Item here ... Yet")
    }
})

function addItemToShoppingList(item){
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")

    newEl.textContent = itemValue
    newEl.id = itemID
    newEl.addEventListener("click", function (){
        let itemLocation = ref(database, `shopping-list/${itemID}`)
        remove(itemLocation)
    })

    shoppingListEl.append(newEl)
}

document.addEventListener("DOMContentLoaded", function(){
    let recipeId = sessionStorage.getItem("recipeId")

    if(recipeId){
        addRecipeToList(recipeId)
    }
})

function addRecipeToList(recipeName){
    get(ref(database, "recipe-list")).then((snapshot) => {
        let recipeData = Object.entries(snapshot.val())

        recipeData.forEach(function([recipeKey, recipeValue]){
            Object.entries(recipeValue).forEach(function([key, value]){
                if(key == "name" && value == recipeName){
                    Object.entries(recipeValue).forEach(function([key, value]){
                        if(key != "name"){
                            push(shoppingListInDB, value)
                        }
                    })
                    sessionStorage.setItem("recipeId", "")
                }
            })
        })
    })
}

recipesPageButtonEl.addEventListener("click", function(){
    window.location.href = "recipes.html"
})

contactPageButtonEl.addEventListener("click", function(){
    window.location.href = "contact.html"
})