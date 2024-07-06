import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { clear_field, add_item_to_html_list, clear_HTML_list } from "./functions.js"

const appSettings = {
    databaseURL: "https://grocerylist-82ff0-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const loginInfoDB = ref(database, "login-info")

const usernameInputEl = document.getElementById("username-input")
const passwordInputEl = document.getElementById("password-input")
const submitButtonEl = document.getElementById("submit-button")
const newUserButtonEl = document.getElementById("newUser-button")

newUserButtonEl.addEventListener("click", function(){
    let newUser = {
        password: passwordInputEl.value,
        username: usernameInputEl.value
    }

    push(loginInfoDB, newUser)
})

submitButtonEl.addEventListener("click", function(){
    get(loginInfoDB).then((snapshot) => {
        let loginData = Object.entries(snapshot.val())
        let foundUser = false

        loginData.forEach(function(entry){
            let [key, value] = entry
            if (value.password === passwordInputEl.value && value.username === usernameInputEl.value){
                foundUser = true
            }
        })

        if(foundUser){
            window.location.href = "list.html"
        }
        else{
            alert("Incorrect Credentials!")
        }
    })
})

