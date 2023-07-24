const apiHost = "https://csc346chat.test.apps.uits.arizona.edu"

/*
    The addEventListener for this app does a couple of things, more for
    splitting things up logicly, so that any given function isn't too 
    big, and able to be worked on.
*/
window.addEventListener("load", () => {
    setup()
    loadChats()
    checkLoginTicket()
})

// Create an instance of ChatAPI
var chatApi = new ChatAPI()

// Get a reference to the window.sessionStorage object for this page
var sessionStorage = window.sessionStorage

// Build a URL object from this document.location. We'll use this 
// object to access various parts of the URL such as the query string
// arguments, and the origin.
var locationURL = new URL(document.location)

// Initialize some global variables to keep track of application state.
var user = null
var authJWT = null
var newestChatTimestamp = null
var oldestChatTimestamp = null

/*
    setup()

    The setup function loads any existing state from sessionStorage. 
    Depending on if a user is found in sessionStorage, the Login Button
    needs to be updated to show the Login link, or the Logout link.
*/
function setup() {
    // Check local storage to see if we're logged in
    if (sessionStorage.getItem("user")) {
        // Load the "user" key from sessionStorage and store it on the global "user" 
        // See https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
        user = sessionStorage.getItem("user")
        // Load the "authJWT" key from sessionStorage and store it on the global "authJWT" variable
        authJWT = sessionStorage.getItem("authJWT")
        // Call updateLoginButton with the user variable
        updateLoginButton(user)
    } else {
        // If there's no user in sessionStorage, just call updateLoginButton with no argument
        updateLoginButton()
    }

    // Attach a click handler to the new chat button
    const newChatButton = document.getElementById("newchatbutton")
    newChatButton.addEventListener("click", handleNewChat)

    // Attach a click handler to the load older chats button
    const olderChatsButton = document.getElementById("olderchatsbutton")
    olderChatsButton.addEventListener("click", handleOlderChats)
}

/*
    checkLoginTicket()

    This function checks to see if there is a ticket key in the query string
    arguments of the current URL. If this is, we will call the chatApi.authenticate
    method to log in the current user. 

    All of the calls to chatApi methods are part of an async / await setup.
    This simplifies things and removes the need to deal with additional callback functions
*/
async function checkLoginTicket() {
    // Get the query string parameters out of the locationURL object created above.
    let params = locationURL.searchParams

    // We can construct a service signature for our app by getting the origin from
    // the locationURL object. This doesn't have a trailing slash, so we need to 
    // append that to create our serivce URL. This serves as both an identifier to
    // WebAuth, as well as being the URL that the login process will return the 
    // user to. This will be something like "http://localhost:8080/" if you're working
    // locally, or "http://35.98.109.25/" if you're running on your EC2 instance.
    let service = locationURL.origin + "/"

    if (params.has("ticket")) {
        let ticket = params.get("ticket")
        loginResponse = await chatApi.authenticate(ticket, service)
        handleLogin(loginResponse)
    } else {
        console.log("No Ticket")
    }
}

/*
    loadChats(startTime=null, endTime=null)

    The loadChats function can be called without any arguments, or with 
    start or end times. You should only pass in the startTime or endTime
    in a given call, not both.
*/
async function loadChats(startTime=null, endTime=null) {
    var chat_response = null
    if (endTime != null) {
        chat_response = await chatApi.getChatsBefore(endTime)
    } else {
        chat_response = await chatApi.getChat(startTime)
    }

    if (chat_response == undefined) {
        console.error("chat_response not set")
        return
    }

    if (chat_response.status != "OK") {
        console.error(chat_response.message)
        return
    }

    chats = chat_response.messages

    // Depending on if we're loading new chats or old chats, we need
    // to add them to the top or bottom of the existing chats.
    var position = "end"
    if (startTime != null) {
        position = "beginning"
    }

    chats.forEach(chat => {
        makeNewChatElement(chat, position=position)
    });

}

/*
    makeNewChatElement(chat, position="end")

    Create a new chat element on the page, either at the beginning or end
    of the list.
*/
function makeNewChatElement(chat, position="end") {
    // We need to track the newest and oldest chat timestamps
    // These will be referenced when loading newer or older chats
    if (newestChatTimestamp == null) {
        newestChatTimestamp = chat.timestamp
    } else if (chat.timestamp > newestChatTimestamp) {
        newestChatTimestamp = chat.timestamp
    }

    if (oldestChatTimestamp == null) {
        oldestChatTimestamp = chat.timestamp
    } else if (chat.timestamp < oldestChatTimestamp) {
        oldestChatTimestamp = chat.timestamp
    }

    // Get a reference to the chatcontainer element.
    let container = document.getElementById("chatcontainer")

    // Create a new DIV to hold the new chat.
    let newChat = document.createElement("div")
    newChat.classList.add("list-group-item")

    // Add the username and date string to the new chat.
    let chatUsername = document.createElement("small")
    d = new Date(Number(chat.timestamp) * 1000)
    chatUsername.textContent = "@" + chat.username + " (" + d.toLocaleDateString() + " " + d.toLocaleTimeString() + ")"

    // Add the chat message to the new chat element.
    let chatMessage = document.createElement("div")
    chatMessage.textContent = chat.message

    newChat.appendChild(chatUsername)
    newChat.appendChild(chatMessage)

    if (position == "end") {
        // If the new chat needs to go on the end, we call appendChild
        container.appendChild(newChat)
    } else {
        // If the new chat needs to go at the beginning, we need to use
        // insertBefore, and the position of the first child.
        container.insertBefore(newChat, container.children[0])
    }
}

/*
    handleLogin(loginResponse)

    This function is called after chatApi.authenticate if there was a ticket
    in the URL of the page. It needs to get the username and jwt values 
    returned from the API call, and store them in sessionStorage as well 
    as the `user` and `authJWT` variables. See the API documentation for
    the return format of a login response.
*/
function handleLogin(loginResponse) {
    // Re-write the URL to remove the ?ticket=ST- login ticket 
    // so you can bookmark or reload the page easily
    window.history.replaceState(null, '', '/')

    // *************************************
    //               PART 3
    // *************************************
    // Store the username from the response in the "user" variable defined above
    user = loginResponse.username
    // Store the jwt from the response in the "authJWT" variable defined above
    authJWT = loginResponse.jwt
    // Store the "user" variable in session storage in a key named "user"
    // See https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
    sessionStorage.setItem("user", user)
    // Store the "authJWT" variable in session storage in a key named "authJWT"
    sessionStorage.setItem("authJWT", authJWT)
    // We need to also update the Login Button after a successful login
    updateLoginButton(user)
}

/*
    handleLogout()

    Clear the stored session data, reset the user and authJWT variables,
    and reload the page to reset everything.
*/
function handleLogout() {
    sessionStorage.removeItem("user")
    sessionStorage.removeItem("authJWT")
    user = null
    authJWT = null
    window.location.reload(true)
}

/*
    updateLoginButton(username=null)

    Update the user interface depending on if someone is logged in or not.
*/
function updateLoginButton(username=null) {
    const loginElement = document.getElementById("userlogin")
    const newChatForm = document.getElementById("newchatcontainer")
    let loginLinkElement = document.createElement("a")
    if (username == null || username == "") {
        // <a href="https://csc346chat.test.apps.uits.arizona.edu/login?service=http://localhost:8080/app.html">Login</a>
        let loginURL = apiHost + "/login?service=" + locationURL.origin + locationURL.pathname
        loginLinkElement.href = loginURL
        loginLinkElement.textContent = "Login"

        // Hide the new chat form
        newChatForm.hidden = true
    } else {
        // Set up a logout link
        let loginURL = "#"
        loginLinkElement.href = loginURL
        loginLinkElement.textContent = "Logout: " + username
        loginLinkElement.addEventListener("click", handleLogout)

        // Show the new chat form
        newChatForm.hidden = false
    }

    while (loginElement.firstChild) {
        loginElement.removeChild(loginElement.firstChild)
    }

    loginElement.appendChild(loginLinkElement)
}

/*
    handleNewChat(event)

    This function handles the button click for posting a new chat message.
    It gets the text of the new chat input field, and calls the postChat
    method on the API.
*/
async function handleNewChat(event) {
    // Don't submit the form through the default mechanism
    event.preventDefault()

    const chatTextInputElement = document.getElementById("newchatinput")
    const chatText = chatTextInputElement.value

    let newChatResponse = await chatApi.postChat(chatText)

    if (newChatResponse.status != "OK") {
        console.error(newChatResponse.message)
        return
    }

    // If everything worked, clear out the chat input field
    chatTextInputElement.value = ""

    // Load the new chat
    loadChats(newestChatTimestamp, null)
}

/*
    handleOlderChats(event)

    This function handles the button click for loading older chats.
*/
async function handleOlderChats(event) {
    // Don't submit the form through the default mechanism
    event.preventDefault()

    // Load the old chats
    loadChats(null, oldestChatTimestamp)
}
