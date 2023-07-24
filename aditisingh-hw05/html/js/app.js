

// add an 'load' event listener to the window object to call 
// the loadInitialChats() function when loading is complete
window.addEventListener('load', loadInitialChats)
// We haven't talked about async / await yet, but it is a modern
// JavaScript construct to wait for certain asynchronous operations
// to finish first before going on. 
// Any function using `await` must be designated as `async` in 
// the function declaration
async function loadInitialChats() {
    let chat_response = await fetch("https://770qcaje2h.execute-api.us-west-2.amazonaws.com/Prod/chat")
                            .then((response) => response.json())
    // It may be helpful to examine the contents of chat_response :) 
    console.log(chat_response)
    // Check to make sure that the chat_response.status is "OK"
    // if it is not, log the status and error message to the console
    if (chat_response.status!="OK"){
        console.log(chat_response.status)
        console.log("Error")
    }
    // get a reference to the chat message returned
    let message = chat_response.messages
    // for each message in the chats array, call the 
    // makeNewChatElement(chat) function and pass the current chat
    // to it from the loop.
    for(let i = 0; i<5; i++){
        makeNewChatElement(message[i])
    }
    
}

function makeNewChatElement(chat) {
    // create a new HTML element of type "div" in a variable named 'newChat'
    const newChat = document.createElement("div")

    // add "list-group-item" to the classList of your newDiv
    newChat.classList.add("list-group-item")
    // create a new HTML element of type "small"
    const smallElement = document.createElement("small")
    // create a new Date() object with the timestamp
    let d = new Date(Number(chat.timestamp) * 1000)
    let dateString = d.toLocaleDateString()
    // set the textContent of your new element to look like the following:
    // @fischerm (10/3/2022)
    // Where fischerm comes from the username property of the current chat object
    // and the date comes from dateString computed above.
    smallElement.textContent = chat["username"] +" ("+dateString+")"
    // append this new element with the username and date in it 
    // to the 'newChat' element.
    newChat.append(smallElement)
    // create a new HTML element of type "div"
    const newDiv = document.createElement("div")
    // set the textContent of this new div to the chat.message
    newDiv.textContent = chat["message"]
    // append this new element with the message in it to the 'newChat' element.
    newChat.append(newDiv)
    // get a reference to the "chatcontainer" element
    chatContainer = document.getElementById("chatcontainer")
    // append the 'newChat' element to the container element
    chatContainer.append(newChat)
}
