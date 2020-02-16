var random;
var score = 100;
var luckyNumbers = getRandomArray(50, 100);
UpdateScore();

function PlaceBet(betAmount)
{    
    random = getRandomInt(100);

    console.log("luckyNumbers: " + luckyNumbers);
    console.log("random: " + random)

    if (luckyNumbers.includes(random))
    {
        document.getElementById("result").innerHTML = "😁" 
        score += betAmount;        
    }
    else
    {
        document.getElementById("result").innerHTML = "😑";
        score -= betAmount;        
    }
    
    UpdateScore();    
}

//Generates a random integer
function getRandomInt(max) 
{
    return Math.floor(Math.random() * Math.floor(max));
}

//Generates an array of random numbers of a specified length and specified height of numbers.
function getRandomArray(lenghtOfArray, maxHeightOfNumbers)
{
    var array = [];

    for (var i = 0; i <lenghtOfArray; i++)
    {
        array.push(getRandomInt(maxHeightOfNumbers)); //adds generated random number to array
    }

    return array;
}
  
function UpdateScore()
{
    document.getElementById("score").innerHTML = "Coins: " + score;

    if(score >= 100)
    {
        DisableElement("button100", false);
    }
    else
    {
        DisableElement("button100", true);
    }

    if (score <= 0)
    {
        document.getElementById("result").innerHTML = "Game over 😭";
        DisableElement("button10", true);        
    }    
}

function DisableElement(elementId, boolDisabled)
{
    var button = document.getElementById(elementId).disabled = boolDisabled;
}

