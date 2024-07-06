import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { clear_field, add_item_to_html_list, clear_HTML_list } from "./functions.js"

const appSettings = {
    databaseURL: "https://grocerylist-82ff0-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const contactDB = ref(database, "contact")

const emailInputEl = document.getElementById("email-input")
const messageInputEl = document.getElementById("message-input")
const sendButtonEl = document.getElementById("send-button")
const goBackButtonEl = document.getElementById("go-back-button")

sendButtonEl.addEventListener("click", function(){
    let email = emailInputEl.value
    let message = messageInputEl.value
    let ending = "@gmail.com"

    if(!email.endsWith(ending)){
        alert("Incorrect Email!")
    }
    else{
        push(contactDB, email + ": " + message)
        alert("Message Sent!")
        clear_field(emailInputEl)
        clear_field(messageInputEl)
        window.location.href = "list.html"
    }
})

goBackButtonEl.addEventListener("click", function(){
    window.location.href = "list.html"
})
