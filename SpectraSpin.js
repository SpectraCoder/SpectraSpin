/*
    SPECTRASPIN
    CREATED BY: BAS TEMPELMAN
    ©2020
*/

const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");

const canvasSlots = document.getElementById("canvasSlots");
const canvasSlotsContext = canvasSlots.getContext("2d");

const canvasButtonClicks = document.getElementById("canvasButtonClicks");
const canvasButtonClicksContext = canvasButtonClicks.getContext("2d");

const canvasScore = document.getElementById("canvasScore");
const canvasScoreContext = canvasScore.getContext("2d");

canvasSlotsContext.rect(0,89,canvasSlots.width, 128);   //crops the canvas to only display inside the slots 
canvasSlotsContext.clip();                              //crops the canvas to only display inside the slots

var imageInterface = new ImageSource("Images/Interface.png", x=0,y=0, width=384, height=270);
var imageButtonBet10 = new ImageSource("Images/Button_Bet_10.png", x=80, y=240, width=96, height=32);
var imageButtonBet100 = new ImageSource("Images/Button_Bet_100.png", x=200, y=240, width=96, height=32);
var imageButtonTryAgain = new ImageSource("Images/Button_TryAgain.png", x=135, y=150, width=128, height=32);
var imageIcons = new ImageSource("Images/Icons.png", x=0,y=0, width=64, height=675);

var imageStar = new ImageSource("Images/01_Star_Still.png", x=0,y=0, width=64, height=128);
var imageSeven = new ImageSource("Images/02_Seven_Still.png", x=0,y=0, width=64, height=128);
var imageMelon = new ImageSource("Images/03_Melon_Still.png", x=0,y=0, width=64, height=128);
var imageCherry = new ImageSource("Images/04_Cherry_Still.png", x=0,y=0, width=64, height=128);
var imageDollar = new ImageSource("Images/05_Dollar_Still.png", x=0,y=0, width=64, height=128);
var imageFiche = new ImageSource("Images/06_Fiche_Still.png", x=0,y=0, width=64, height=128);
var imageGrapes = new ImageSource("Images/07_Grapes_Still.png", x=0,y=0, width=64, height=128);
var imageHeart = new ImageSource("Images/08_Heart_Still.png", x=0,y=0, width=64, height=128);
var imageDiamond = new ImageSource("Images/09_Diamond_Still.png", x=0,y=0, width=64, height=128);

var imageArray = [imageStar, imageSeven, imageMelon, imageCherry, imageDollar, imageFiche, imageGrapes, imageHeart, imageDiamond];

var score = 100;
var scorePosition = {x:1350, y:115};
var slotsResults = [null, null, null];

var soundWin = new Audio("Sounds/Win.mp3");
var soundBet = new Audio("Sounds/Coin.mp3");
var soundSlotStop = new Audio("Sounds/SlotStop.mp3");
var soundGameOver= new Audio("Sounds/GameOver.mp3");

var buttonBet10Hitbox = new Path2D();
var buttonBet100Hitbox = new Path2D();
var buttonTryAgainHitbox = new Path2D();
//buttonBet10Hitbox.closePath();

imageInterface.image.onload = ShowLoadingScreen;
imageInterface.image.onload();

var canvasScale = getCanvasScale();

canvasButtonClicks.addEventListener("click",  ClickButton, false);

window.addEventListener("resize", getCanvasScale, false);

var playAnimation = [false, false, false];

function getCanvasScale()
{
    canvasButtonClicksStyle = window.getComputedStyle(canvasButtonClicks);
    var scaleX = parseInt(canvasButtonClicksStyle.getPropertyValue("width")) / canvasButtonClicks.width;
    var scaleY = parseInt(canvasButtonClicksStyle.getPropertyValue("height")) / canvasButtonClicks.height;

    console.log("ScaleX: " + scaleX + " ScaleY: " + scaleY);
   
    //Scales the hitbox of the Bet10 button to the right size
    buttonBet10Hitbox.rect(imageButtonBet10.x * scaleX, imageButtonBet10.y * scaleY, imageButtonBet10.image.width * scaleX, imageButtonBet10.image.height * scaleY);   
    buttonBet100Hitbox.rect(imageButtonBet100.x * scaleX, imageButtonBet100.y * scaleY, imageButtonBet100.image.width * scaleX, imageButtonBet100.image.height * scaleY);
    buttonTryAgainHitbox.rect(imageButtonTryAgain.x * scaleX, imageButtonTryAgain.y * scaleY, imageButtonTryAgain.image.width * scaleX, imageButtonTryAgain.image.height * scaleY);
}


function ClickButton(e) 
{
    console.log("Clicked!");
    var mousePosition = getMousePosition(canvasButtonClicks, e);        

    var marginLeft = canvasButtonClicksStyle.getPropertyValue("marginLeft");
    var marginTop = canvasButtonClicksStyle.getPropertyValue("marginTop");

    if (!playAnimation[2]) //if the last slot is not playing
    {          
        //BET 10
        if (canvasButtonClicksContext.isPointInPath(buttonBet10Hitbox, mousePosition.x - marginLeft, mousePosition.y - marginTop) && (score >= 10)) 
        {            
            Bet(10);            
        }

        //BET 100
        if (canvasButtonClicksContext.isPointInPath(buttonBet100Hitbox, mousePosition.x - marginLeft, mousePosition.y - marginTop)  && (score >= 100)) 
        {
            Bet(100);
        }

        //TRY AGAIN
        if (canvasContext.isPointInPath(buttonTryAgainHitbox, mousePosition.x - marginLeft, mousePosition.y - marginTop) && (score <= 0))
        {
            window.location.reload();
        }

        function Bet(betAmount)
        {            
                UpdateScore(-betAmount,1,`Player bets ${betAmount}. Score: `);
                soundBet.play();
                new PlayAnimation(betAmount, 38, 89 , slotNumber = 0);     
                new PlayAnimation(betAmount, 118, 89, slotNumber = 1);
                new PlayAnimation(betAmount, 198, 89, slotNumber = 2);
        }        
    }    
} 

function CheckGameOver(e)
{
    if (score <= 0)
    {        
        ClearCanvas(canvas);
        ClearCanvas(canvasSlots);
        ClearCanvas(canvasScore);
        DrawText(canvasScoreContext, "Game over", canvasScore.width/2 ,canvasScore.height/2, font = "bold 200px Pixel Cowboy", fillstyle = "white", textalign = "center");
        DrawImage(canvasContext, imageButtonTryAgain.image, imageButtonTryAgain.x, imageButtonTryAgain.y);
        soundGameOver.play();
    }
}



function Draw()
{           
    DrawImage(canvasContext, imageInterface.image,0,0);
    DrawImage(canvasContext, imageButtonBet10.image, imageButtonBet10.x, imageButtonBet10.y);
    DrawImage(canvasContext, imageButtonBet100.image, imageButtonBet100.x, imageButtonBet100.y);   
    DrawText(canvasScoreContext, "$100", scorePosition.x, scorePosition.y); 
}

function DrawImage(canvas, image, posX, posY)
{        
    canvas.drawImage(image, posX, posY, image.width, image.height);
}

function PlayAnimation(betAmount, xPosition, yPosition, slotNumber)
{       
    console.log("slotNumber: " + slotNumber)
    playAnimation[slotNumber] = true;
    var timer = 0;
    var playTime = [100,200,300];
    var startPositionY = yPosition;
    var speed = 10;    
    
    requestAnimationFrame(Animation);
    
    function Animation()
    {             
        timer++;        

        if(timer > playTime[slotNumber])
        {
            playAnimation[slotNumber] = false;
            soundSlotStop.play();            
            DrawResult(xPosition, startPositionY, betAmount, slotNumber);
            return;
        }     

        if(!playAnimation)
        {              
            return;
        }        
       
        DrawImage(canvasSlotsContext, imageIcons.image, xPosition, yPosition);
  
        yPosition -= speed;     

        if(yPosition < -512)
        {
            yPosition = startPositionY;
        } 
        
        requestAnimationFrame(Animation);        
    }   

}



function DrawResult(xPosition, yPosition, betAmount, slotNumber)
{      
    if (slotNumber == 0)
    {
        slotsResults = [null, null, null];
    }
    
    slotsResults[slotNumber] = getRandomInt(0,8);
    console.log("Results: " + slotsResults);    

    DrawImage(canvasSlotsContext, imageArray[slotsResults[slotNumber]].image, xPosition, yPosition);     

    if(slotNumber == 2)
    {
        CheckScoring(slotsResults, betAmount);   
        setTimeout(CheckGameOver, 1000);
    }      
    
}  

function CheckScoring(slotsResultsArray, betAmount)
{
    //1x GRAPE
    if (slotsResultsArray.includes(6)) 
    {
        UpdateScore(betAmount, 2,"GRAPES x2 score:");        
    } 

    //2x SEVEN
    if ((slotsResultsArray[0] == 1) && (slotsResultsArray[1] == 1) || (slotsResultsArray[1] == 1) && (slotsResultsArray[2] == 1))
    {        
        UpdateScore(betAmount, 7,"2x SEVEN! x7 score:"); 
    }

    //3x MELON
    if ((slotsResultsArray[0] == 2) && (slotsResultsArray[1] == 2) && (slotsResultsArray[2] == 2))
    {
        UpdateScore(betAmount, 10,"3x MELON! x10 score:"); 
    }

    //3x CHERRY
    if ((slotsResultsArray[0] == 3) && (slotsResultsArray[1] == 3) && (slotsResultsArray[2] == 3))
    {    
        UpdateScore(betAmount, 20,"3x CHERRY! x20 score:"); 
    }

    //3x HEART
    if ((slotsResultsArray[0] == 7) && (slotsResultsArray[1] == 7) && (slotsResultsArray[2] == 7))
    {        
        UpdateScore(betAmount, 50,"3x HEART! x50 score:"); 
    }

    //3x FICHE
    if ((slotsResultsArray[0] == 5) && (slotsResultsArray[1] == 5) && (slotsResultsArray[2] == 5))
    {        
        UpdateScore(betAmount, 100,"3x FICHE! x100 score:"); 
    }

    //3x DOLLAR
    if ((slotsResultsArray[0] == 4) && (slotsResultsArray[1] == 4) && (slotsResultsArray[2] == 4))
    {        
        UpdateScore(betAmount, 250,"3x DOLLAR! x250 score:");
    }

    //3x DIAMOND
    if ((slotsResultsArray[0] == 8) && (slotsResultsArray[1] == 8) && (slotsResultsArray[2] == 8))
    {       
        UpdateScore(betAmount, 500,"3x DIAMOND! x500 score:");
    }

    //3x STAR
    if ((slotsResultsArray[0] == 0) && (slotsResultsArray[1] == 0) && (slotsResultsArray[2] == 0))
    {        
        UpdateScore(betAmount, 1000,"3x STAR! x1000 score:");
    }
    
    else
    {   
        UpdateScore(0, 0,"Score:");
        return;
    }


    
}

function UpdateScore(betAmount, multiplier, consoleMessage = "")
{
    score += (betAmount * multiplier);    
    ClearCanvas(canvasScore);
    DrawText(canvasScoreContext, '$' + score, scorePosition.x, scorePosition.y);

    if (multiplier > 1)
    {
        soundWin.play();
    }

    if(consoleMessage != "")
    {
        console.log(consoleMessage + " " + score);
    }
    
}

function ClearCanvas(canvas)
{
    canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height);
}

function ShowLoadingScreen()
{
    document.onreadystatechange = function()
    {
        var state = document.readyState;
        
        if (state == 'interactive') 
        {
            //document.getElementById('wrapper').style.visibility="hidden";
            ClearCanvas(canvas);
            ClearCanvas(canvasSlots);
            ClearCanvas(canvasScore);
            DrawText(canvasScoreContext, "Loading...", canvasScore.width/2 ,canvasScore.height/2, font = "bold 200px Pixel Cowboy", fillstyle = "white", textalign = "center");
        }
    
        else if (state == "complete"){         
            
            function LoadComplete()
            {                
                ClearCanvas(canvasScore);
                Draw();
            }
    
            setTimeout(LoadComplete, 1000);
        }
    }
}

//Function to get the mouse position
function getMousePosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

//Function to check whether a point is inside a rectangle
function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
}

//Generates a random integer
function getRandomInt(min, max) 
{
    return Math.floor(Math.random() * Math.floor(max) + min);
}

function DrawText(canvascontext, text, positionX, positionY, font = "bold 100px Pixel Cowboy", fillstyle = "white", textalign = "right")
{
    canvascontext.font = font;
    canvascontext.fillStyle = fillstyle;
    canvascontext.textAlign = textalign;    
    canvascontext.fillText(text, positionX, positionY);
}