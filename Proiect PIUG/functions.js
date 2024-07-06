export function clear_field (element) {
    element.value = ""
}

export function add_item_to_html_list (element, value) {
    element.innerHTML += `<li>${value}</li>`
}

export function clear_HTML_list(element){
    element.innerHTML = ""
}