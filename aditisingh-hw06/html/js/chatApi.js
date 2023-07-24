/*

ChatAPI

To use this ChatAPI class in app.js, create an instance of it:
    
    var chatApi = new ChatAPI()

From there, you should only need to call the convenience methods:

    chatApi.authenticate(ticket, service)
    chatApi.getChat()
    chatApi.getChat(startTime)
    chatApi.getChatsBefore(endTime)
    chatApi.postChat(chatText)

*/
function ChatAPI() {
    /*
        this.apiCall() should only be called from within this class

        Parameters:
            method: The HTTP method for this API call, [GET, POST, PUT]
            action: The path portion of the API call, ie `chat` or `authenticate`
                    See the API documentation for a complete list of actions
            requiresAuth: A boolean value to indicate if this API call needs to
                            send the Authorization header along with the call.
                            It defaults to `false` if not passed in.
            data:   A simple javascript data object with key/value pairs to
                    send as the body of a POST or PUT request. This object will
                    be encoded with JSON.stringify before being sent.
    */
    this.apiCall = function(method, action, requiresAuth=false, data=null) {
        let options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        }

        if (requiresAuth) {
            if (authJWT == null) {
                console.error("authJWT is null. Are you logged in?")
                return
            }
            options.headers["Authorization"] = "Bearer " + authJWT
        }

        if (data != null) {
            if (method != "POST" && method != "PUT") {
                console.error("Method not allowed when sending data: " + method)
                return
            }

            options.body = JSON.stringify(data)
        }

        let response = fetch(apiHost + "/" + action, options)
                        .then((response) => {
                            if (response.status != 200) {
                                resp_object = response.json().then((errorJson) => {
                                    throw new Error(response.status + ': ' + errorJson.message)
                                })
                                .catch((error) => { console.error(error) })
                                return "Error status: " + response.status
                            } else {
                                return response.json()
                            }
                        })
                        .catch((error) => { console.error(error) });
        return response
    }

    /*
        ChatAPI.getChat()
        ChatAPI.getChat(startTime)

        This method is calld to either fetch the most recent 5 chats, or to pull all chats
        since a given timestamp. If startTime is not provided in the API call, then just
        the basic `chat` action will be called on the API. If the startTime is set, then
        the `chat/after/{timestamp}` action will be called.

        startTime: A string version of the timestamp of a chat, ie 1666235802.930319
    */
    this.getChat = function(startTime=null) {
        let action = ""
        if (startTime == null) {
            action = "chat"
        } else {
            action = "chat/after/" + startTime
        }
        return this.apiCall("GET", action)
    }

    /*
        ChatAPI.getChatsBefore(endTime)

        This method is will call the `chat/before/{timestamp}` action, where timestamp
        is the endTime of chats to fetch, and chats before that time will be fetched.

        endTime: A string version of the timestamp of a chat, ie 1666235802.930319
    */
    this.getChatsBefore = function(endTime) {
        // Similar to the aboive method, this method should return the result of 
        // a call to this.apiCall with an HTTP GET method, and the chat/before/{timestamp}
        // action on the API.
        // *************************************
        //               PART 1
        // *************************************
        let action = ""
        if (endTime== "null"){
            action = "chat"
        }
        else{
            action = "chat/before/" + endTime
        }
        return this.apiCall("GET", action)
    }

    /*
        ChatAPI.authenticate(ticket, service)

        This method will call the `authenticate/{ticket}?service={service}` action on 
        the API. Ticket will be the WebAuth CAS ticket returned after a successful login
        to WebAuth. Service is the URL of your application, so the verification of the 
        ticket matches the initial request. See app.js for hints on how to construct this.
    */
    this.authenticate = function(ticket, service) {
        // This method should return the result of a call to this.apiCall with an
        // action of authenticate/{ticket}?service={service}
        // *************************************
        //               PART 2
        // *************************************
        let action = ""
        action = "authenticate/"+ticket+"?service="+service
        return this.apiCall("GET", action)
    }

    /*
        ChatAPI.postChat(chatText)

        This method will call the `POST chat` action on the API. There's just a single
        chatText containing the text of the new chat to store. Times and user will be
        recorded based on the time its posted, and the logged in user. This call must
        be authenticated.
    */
    this.postChat = function(chatText) {
        return this.apiCall("POST", "chat", true, {"message": chatText})
    }
}
