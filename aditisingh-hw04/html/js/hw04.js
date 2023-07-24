function runProblem1(event) {
    var answerElement = document.getElementById("problem1answer")
    answerText = `${event.target.id} clicked.  x(${event.x}) y(${event.y})`
    answerElement.textContent = answerText
}
problem1 = document.getElementById("problem1button")
problem1.addEventListener("click", runProblem1)
function runProblem2(event) {
    // Create a new Date object and store it in a new variable.
    d = new Date();
    // Call the toDateString() method on your variable, and store
    //     the result in a new variable named answerText.
    answerText = d.toDateString()
    // Obtain a reference to the problem2answer element and 
    //     store it in a variable named answerElement.
    answerElement = document.getElementById("problem2answer")
    // Assign the answerText to the answerElement's textContent property.
    answerElement.textContent = answerText
}
// Obtain a reference to the problem2button element, and store it
//     in a variable named problem2
problem2 = document.getElementById("problem2button")
// Attach an event listener to the problem2 element's click event
//     and pass it our runProblem2 function.
problem2.addEventListener("click", runProblem2)

function runProblem3(event) {
    // Obtain a reference to the problem3input element and 
    //     store it in a variable named inputElement.
    inputElement = document.getElementById("problem3input")
    // Get the value from the text input element and store it 
    //     in a variable named inputString.
    inputString = inputElement.value

    // Create an array from the inputString by separating each part 
    //     delimited by a comma into a new array element and store
    //     it in a variable named inputArray
    inputArray = inputString.split(",")
    
    // Make a nicely formatted string of the inputArray using the 
    //     JSON.stringify() method, and store the result in a 
    //     variable named answerText.
    answerText = JSON.stringify(inputArray)
    
    // Obtain a reference to the problem3answer element, and store it
    //     in a variable named answerElement.
    answerElement = document.getElementById("problem3answer")
    // Update the textContent of the answerElement with the answerText.
    answerElement.textContent = answerText
}
// Obtain a reference to the problem3button element, and store it
//     in a variable named problem3.
problem3 = document.getElementById("problem3button")
// Attach an event listener to the problem3 element's click event
//     and pass it our runProblem3 function.
problem3.addEventListener("click", runProblem3)

function Fibonacci() {
    // Initialize a previousNumber property to 0
    this.previousNumber = 0

    // Initialize a currentNumber property to 0
    this.currentNumber = 0
    // Create a setFirst() method to set the previousNumber property
    this.setFirst = function(value) {
        // Assign value to the previousNumber property.
        this.previousNumber = Number(value)
        // Don't forget to convert it to a Number first.
    }

    // Create a setSecond() method to set the currentNumber property
    this.setSecond = function(value){
        this.currentNumber = Number(value)
    }
    // Create a getNextValue() method.
    this.getNextValue = function() {
        // Calculate the next value and store it in a temporary variable
        nextValue = this.previousNumber + this.currentNumber
        // Set the previous number to the current number
        this.previousNumber = this.currentNumber
        // Set the current number to the next value
        this.currentNumber = nextValue
        // return the next value
        return nextValue
    }
}
function runProblem4(event) {
    // Obtain a reference to the problem4input element and 
    //     store it in a variable named inputElement.
    inputElement = document.getElementById("problem4input")
    // Get the value from inputElement and store it in startValues
    startValues = inputElement.value
    // Split the startValues into an array named startValuesArray
    startValuesArray = startValues.split(",")
    // Create a new Fibonacci object
    obj = new Fibonacci()
    // Call setFirst() on your object with the first 
    //      element of startValuesArray
    obj.setFirst(startValuesArray[0])
    // Call setSecond() on your object with the second 
    //      element of startValuesArray
    obj.setSecond(startValuesArray[1])
    
    // Create an empty array named valuesArray
    valuesArray = []
    // Push the previousNumber from your object on to valuesArray

    valuesArray.push(obj.previousNumber)
    // Push the currentNumber from your object on to valuesArray
    valuesArray.push(obj.currentNumber)
    // Run a loop 10 times 
    for (i = 0 ; i < 10 ; i++) {
      // Call getNextValue() on your object and push the 
      //     result on to valuesArray.
      valuesArray.push(obj.getNextValue())
    }

    // Join all the elements of valuesArray together with ", "
    //     and store the result in answerText.
    answerText = valuesArray.toString(",")
    // Obtain a reference to the problem4answer element, and store it
    //     in a variable named answerElement.
    answerElement = document.getElementById("problem4answer")    
    // Update the textContent of the answerElement with the answerText.
    answerElement.textContent = answerText
}
// Obtain a reference to the problem4button element, and store it
//     in a variable named problem4.
problem4 = document.getElementById("problem4button")
// Attach an event listener to the problem4 element's click event
//     and pass it our runProblem4 function.
problem4.addEventListener("click", runProblem4)

function updateProblem5answer(answerText) {
    // Obtain a reference to the problem5answer element, and store it
    //     in a variable named answerElement.
    answerElement = document.getElementById('problem5answer')

    // Update the textContent of the answerElement with the answerText.
    answerElement.textContent = answerText
}
function runProblem5(event) {
    // Obtain a reference to the problem5input element, and store it
    //     in a variable named inputElement.
    inputElement = document.getElementById("problem5input")
    // Store the value of inputElement in a variable named inputString
    inputString = inputElement.value
    // Use the fetch() API to call the URL of our API, with the 
    //     inputString value appended to the end.
    // .then() handle the response, and return the .text() from it 
    // .then() handle the text from the previous step and pass 
    //      it to updateProblem5answer.
    fetch("https://770qcaje2h.execute-api.us-west-2.amazonaws.com/Prod/healthcheck?parameter="+inputString)
    .then((response) => response.text())
    .then((responseText) => updateProblem5answer(responseText))
}
// Obtain a reference to the problem5button element, and store it
//     in a variable named problem5.
problem5 = document.getElementById("problem5button")
// Attach an event listener to the problem5 element's click event
//     and pass it our runProblem5 function.

problem5.addEventListener("click", runProblem5)